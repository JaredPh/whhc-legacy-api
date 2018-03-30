export interface SessionTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface SessionTokens extends SessionTokenResponse {
    cookieToken: string;
}
