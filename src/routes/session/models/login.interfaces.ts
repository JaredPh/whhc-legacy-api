export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginTokens extends LoginResponse {
    cookieToken: string;
}
