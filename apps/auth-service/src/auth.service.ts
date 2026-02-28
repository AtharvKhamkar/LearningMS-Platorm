import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { ApiResponse, AppJwtService, DatabaseService, FnGetUserProfileDetails, IPgQuery, IUserDb, JwtPayload, ResponseUtil, StorageService } from '@app/common';
import { RegistrationResponseEntity } from './entities';
import { FnChangePasswordResult, FnGetActiveOtpResult, FnInsertUserOtpResult, FnRegisterUserResult, FnSetInactiveOtpResult, FnSetVerifiedUserResult, OtpPurpose } from './types';
import { PasswordUtil } from '@app/common/utils/password.util';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseEntity } from './entities/login-response.enttity';
import { MailClientService } from './mail-client.service';
import { ChangePasswordDto, ForgotPasswordDto, VerifyForgotPasswordDto, VerifyUserDto } from './dtos';
import { OtpUtil } from '@app/common/utils/otp.util';
import { TimeConversionUtil } from '@app/common/utils/time-conversion.util';
import { ForgotPasswordResponseEntity } from './entities/forgot-password-response.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly jwtService: AppJwtService,
    private readonly mailClientService: MailClientService,
    private readonly storageService: StorageService
  ) { }

  async register(registerDto: RegisterDto): Promise<ApiResponse> {

    //env variables for password hashing
    const pepper = this.configService.get<string>('PASSWORD_PEPPER') ?? '';
    const hashedPassword = await PasswordUtil.hash(registerDto.password, pepper);

    //env variables for otp hashing for verification
    const otpPepper = this.configService.get<string>('OTP_PEPPER') ?? '';
    const otpExpiresIn = this.configService.get<string>('EMAIL_VERIFY_EXPIRES_IN') ?? '';

    const otp = OtpUtil.generate();

    const hashedOtp = await OtpUtil.hash(otp, otpPepper);

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_register_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      params: [
        registerDto.firstName,
        registerDto.lastName,
        registerDto.email,
        registerDto.countryCodeId,
        registerDto.languageId,
        registerDto.phoneNumber,
        hashedPassword,
        registerDto.biography,
        registerDto.roleId,
        hashedOtp,
        otpExpiresIn
      ]
    }
    const registerData = await this.databaseService.queryOne<FnRegisterUserResult>(pgQuery);

    if (!registerData?.success) {
      throw new BadRequestException(
        registerData?.message
      )
    }

    const formattedExpiryTime = TimeConversionUtil.formatTime(registerData.data?.expiresAt ?? '');

    await this.mailClientService.verifyEmailAddressEmail({ email: registerDto.email, name: `${registerDto?.firstName} ${registerDto?.lastName}`, otp: otp, expiresAt: formattedExpiryTime });

    await this.mailClientService.sendWelcomeEmail({ email: registerDto.email, name: `${registerDto.firstName} ${registerDto.lastName}` })

    return ResponseUtil.success(
      'User registered successfully',
      new RegistrationResponseEntity({
        userId: registerData.data?.userId,
        isVerified: registerData.data?.isVerified
      })
    );
  }

  async verifyUser(dto: VerifyUserDto): Promise<ApiResponse> {

    //Env variables
    const pepper = this.configService.get<string>('OTP_PEPPER') ?? '';

    //3. Save Otp entry in the DB
    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_get_active_otp($1, $2, $3)`,
      params: [
        OtpPurpose.emailVerification,
        null,
        dto.email
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnGetActiveOtpResult>(pgQuery);

    if (!queryResult?.success || !queryResult.data) {
      throw new BadRequestException(queryResult?.message);
    }

    const isVerified = await OtpUtil.verify(dto.otp, queryResult.data.otpHash, pepper);

    console.log({ isVerified });


    if (!isVerified) {
      throw new BadRequestException('Invalid OTP');
    }

    const pgSetVerifiedUserQuery: IPgQuery = {
      query: `SELECT * FROM fn_set_verified_user($1)`,
      params: [
        dto.email
      ]
    }

    const setVerifiedUserQueryResult = await this.databaseService.queryOne<FnSetVerifiedUserResult>(pgSetVerifiedUserQuery);

    if (!setVerifiedUserQueryResult?.success) {
      throw new BadRequestException(setVerifiedUserQueryResult?.message);
    }

    return ResponseUtil.success(
      'User Verified Successfully.',
    )
  }

  async login(loginDto: LoginDto): Promise<ApiResponse> {

    //Get user info query
    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_get_user_profile_details($1, $2, $3)`,
      params: [
        null,
        loginDto.email,
        true
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnGetUserProfileDetails<IUserDb>>(pgQuery);

    if (!queryResult?.success || !queryResult?.data) {
      console.log('Inside the the throw bad request block');

      throw new BadRequestException(queryResult?.message);
    }

    const loginData = queryResult.data;

    if (!loginData || loginData.is_deleted) {
      throw new UnauthorizedException(
        'User not found.'
      );
    }

    if (!loginData.is_verified) {
      throw new ForbiddenException('User is not verified.')
    }

    const pepper = this.configService.get<string>('PASSWORD_PEPPER') ?? '';

    const isPasswordValid = await PasswordUtil.verify(loginData.password, loginDto.password, pepper);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //3. Generate access token and refresh token
    const jwtPayload: JwtPayload = { sub: loginData.user_id.toString(), email: loginData.email, firstName: loginData.first_name, lastName: loginData.last_name, role: loginData.role, permissions: loginData.permissions, phoneNumber: loginData.phone_number }

    const { accessToken, refreshToken } = await this.jwtService.generateTokens(jwtPayload);

    //set refresh token query
    const setRefreshtokenPgQuery: IPgQuery = {
      query: `UPDATE tbl_users SET refresh_token = $1 WHERE email = $2`,
      params: [
        refreshToken,
        loginDto.email
      ]
    }

    const updateRefreshToken = await this.databaseService.query(setRefreshtokenPgQuery);

    //fetch signed profile , cover image urls.
    const [profileImageUrl, coverImageUrl] = await Promise.all([
      await this.storageService.getSignedFileUrl(loginData?.profile_image),
      await this.storageService.getSignedFileUrl(loginData?.cover_image)
    ])    

    return ResponseUtil.success(
      'User logged in successfully.',
      new LoginResponseEntity(
        {
          email: loginData.email,
          firstName: loginData.first_name,
          lastName: loginData.last_name,
          countryCodeId: loginData.country_code_id,
          phoneNumber: loginData.phone_number,
          languageId: loginData.language_id,
          profileImage: profileImageUrl,
          coverImage: coverImageUrl,
          biography: loginData.biography,
          role: loginData.role,
          permissions: loginData.permissions,
          isVerified: loginData.is_verified,
          accessToken: accessToken
        }
      )
    )
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse> {
    //check user exists or not
    //check user is active or not
    //create random six digit otp
    //save otp entry in the DB
    //Send email send event with payload

    //Import all ENV variables
    const pepper = this.configService.get<string>('OTP_PEPPER') ?? '';
    const otpExpiresIn = this.configService.get<string>('FORGOT_PASSWORD_EXPIRES_IN') ?? '';


    // 1. Check user exists and active or not
    const pgUserExistsQuery: IPgQuery = {
      query: `SELECT * FROM tbl_users WHERE email = $1 AND is_disabled = FALSE AND is_deleted = FALSE LIMIT 1`,
      params: [
        forgotPasswordDto.email,
      ]
    }

    const activeUser = await this.databaseService.queryOne<IUserDb>(pgUserExistsQuery);

    if (!activeUser?.user_id) {
      throw new UnauthorizedException(
        'User not found.'
      );
    }

    // 2. Create random six digit otp
    const otp = OtpUtil.generate();

    const hashedOtp = await OtpUtil.hash(otp, pepper);

    //3. Save Otp entry in the DB
    const pgOtpInsertQuery: IPgQuery = {
      query: `SELECT * FROM fn_insert_user_otp($1, $2, $3, $4)`,
      params: [
        activeUser?.user_id,
        hashedOtp,
        OtpPurpose.forgotPassword,
        otpExpiresIn
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnInsertUserOtpResult>(pgOtpInsertQuery);

    if (!queryResult?.success || !queryResult.data?.expiresAt) {
      throw new InternalServerErrorException()
    }

    const formattedExpiryTime = TimeConversionUtil.formatTime(queryResult.data?.expiresAt);

    //Send forgot password mail event to the queue
    await this.mailClientService.forgotPasswordEmail({ email: forgotPasswordDto.email, name: `${activeUser?.first_name} ${activeUser?.last_name}`, otp: otp, expiresAt: formattedExpiryTime });

    const resetToken = await this.jwtService.generateResetToken({
      sub: activeUser.user_id,
      email: activeUser.email
    });


    return ResponseUtil.success(
      'Forgot password mail send successfully',
      new ForgotPasswordResponseEntity({
        resetToken
      })
    )

  }

  async verifyForgotPasswordOtp(userId: string, verifyForgotPasswordDto: VerifyForgotPasswordDto): Promise<ApiResponse> {
    //fetch the encrypted otp stored in db for that user using email
    //verify the otp is correct using argon verify
    //If the it is verified 

    //Env variables
    const pepper = this.configService.get<string>('OTP_PEPPER') ?? '';

    //3. Save Otp entry in the DB
    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_get_active_otp($1, $2, $3)`,
      params: [
        OtpPurpose.forgotPassword,
        userId,
        null
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnGetActiveOtpResult>(pgQuery);

    if (!queryResult?.success || !queryResult.data) {
      throw new BadRequestException(queryResult?.message);
    }

    const isVerified = await OtpUtil.verify(verifyForgotPasswordDto.otp, queryResult.data.otpHash, pepper);

    console.log({ isVerified });


    if (!isVerified) {
      throw new BadRequestException('Invalid OTP');
    }

    const pgSetInactiveOtpQuery: IPgQuery = {
      query: `SELECT * FROM fn_set_inactive_otp($1)`,
      params: [
        queryResult.data.otpId
      ]
    }

    const setInactiveOtpQueryResult = await this.databaseService.queryOne<FnSetInactiveOtpResult>(pgSetInactiveOtpQuery);

    if (!setInactiveOtpQueryResult?.success) {
      throw new BadRequestException(setInactiveOtpQueryResult?.message);
    }


    return ResponseUtil.success(
      'Otp Verified Successfully.',
    )

  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<ApiResponse> {

    const pepper = this.configService.get<string>('PASSWORD_PEPPER') ?? '';

    const hashedPassword = await PasswordUtil.hash(changePasswordDto.password, pepper);


    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_change_user_password($1, $2)`,
      params: [
        userId,
        hashedPassword
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnChangePasswordResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(queryResult?.message);
    }

    return ResponseUtil.success(
      'Password Changed Successfully.',
    )
  }
}
