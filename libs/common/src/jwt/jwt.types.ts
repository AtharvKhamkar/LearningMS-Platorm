export interface JwtPayload{
    sub: string,
    email:string,
    role: string,
    permissions: string[],
    firstName:string,
    lastName:string | null,
    phoneNumber:string | null,
}

export interface ResetTokenPayload{
    sub: string,
    email:string
}

export interface JwtTokens{
    accessToken : string,
    refreshToken : string
}