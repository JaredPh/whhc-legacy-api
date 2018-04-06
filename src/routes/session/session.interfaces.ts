import { ESession } from './session.entity';

export interface IToken {
    type: string;
    verified: boolean;
}

export interface ISessionResult {
    session: ESession;
    token: IToken;
}

export interface ISessionTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ISessionTokens extends ISessionTokenResponse {
    cookieToken: string;
}
