import { ApiResponse, IUserDb } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }

export interface FnGetUserProfileDetails<IUserDb> extends ApiResponse<IUserDb>{}

export type FnUpdateUserProfileDetails = ISqlFnResult<{}>;

export type FnUpdateUserProfileImage = ISqlFnResult<{
    key: string
}>;

export type FnUpdateUserCoverImage = ISqlFnResult<{
    key: string
}>;

export type FnUpdateUserFcmToken = ISqlFnResult<{}>;
