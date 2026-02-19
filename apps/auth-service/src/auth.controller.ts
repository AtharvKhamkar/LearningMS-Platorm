import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, VerifyForgotPasswordDto, VerifyUserDto } from './dtos';
import { LoginResponseEntity, RegistrationResponseEntity } from './entities';
import { ResetPasswordGuard, ResetPasswordUser, type ResetTokenPayload } from '@app/common';
import { ForgotPasswordResponseEntity } from './entities/forgot-password-response.entity';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: RegistrationResponseEntity })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('/verify-user')
  @ApiBody({ type: VerifyUserDto })
  async verifyUser(@Body() dto: VerifyUserDto) {
    return this.authService.verifyUser(dto);
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseEntity })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ type: ForgotPasswordResponseEntity })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(ResetPasswordGuard)
  @Post('/verify-forgot-password-otp')
  @ApiBody({ type: VerifyForgotPasswordDto })
  async verifyForgotPasswordOtp(@ResetPasswordUser() user: ResetTokenPayload, @Body() dto: VerifyForgotPasswordDto) {
    const userId = user.sub;
    return this.authService.verifyForgotPasswordOtp(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(ResetPasswordGuard)
  @Post('/change-password')
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@ResetPasswordUser() user: ResetTokenPayload, @Body() dto: ChangePasswordDto) {
    const userId = user.sub;
    return this.authService.changePassword(userId, dto);
  }
}
