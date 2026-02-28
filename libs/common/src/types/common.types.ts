import { INestApplication } from "@nestjs/common";

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface SwaggerSetupConfigType {
    app: INestApplication,
    title: string,
    description: string,
    apiVersion: string,
    route: string
}

export interface IPgQuery {
    query: string,
    params?: any[]
}


export interface IWelcomeEmailEventPayload {
    email: string,
    name: string
}

export interface IForgotPasswordEmailEventPayload {
    email: string,
    name: string,
    otp: string,
    expiresAt: string
}

export interface IEmailVerifyEmailEventPayload {
    email: string,
    name: string,
    otp: string,
    expiresAt: string
}

export interface FileTypeValidatorOptions {
  allowedMimeTypes: string[];
  allowedExtensions?: string[];
}

export const AllowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg'
]

export const AllowedImageExtensions = [
    '.jpeg',
    '.png',
    '.webp',
    '.jpg'
]

export interface FnGetUserProfileDetails<IUserDb> extends ApiResponse<IUserDb>{}
