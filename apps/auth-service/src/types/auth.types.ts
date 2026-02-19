import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }


export type FnRegisterUserResult = ISqlFnResult<{
    userId: string;
    isVerified: boolean;
    expiresAt: string;
}>;

export type FnInsertUserOtpResult = ISqlFnResult<{
    expiresAt: string
}>

export type FnGetActiveOtpResult = ISqlFnResult<{
    otpId: string;
    otpHash: string;
}>

export type FnSetInactiveOtpResult = ISqlFnResult<{}>;

export type FnSetVerifiedUserResult = ISqlFnResult<{}>;

export type FnChangePasswordResult = ISqlFnResult<{}>;

export enum OtpPurpose {
    forgotPassword = 'FORGOT_PASSWORD',
    emailVerification = 'EMAIL_VERIFICATION',
    phoneVerification = 'PHONE_VERIFICATION'
} 
