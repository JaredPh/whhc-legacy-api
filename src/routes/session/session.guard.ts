import {
    Guard,
    CanActivate,
    ExecutionContext,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SessionService } from './session.service';

import {
    AUTH_HEADER_MISSING,
    INCORRECT_TOKEN_TYPE,
    INVALID_SESSION_TOKENS,
} from '../../utils/errors/error.messages';

@Guard()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly sessionService: SessionService,
    ) {}

    async canActivate(req, context: ExecutionContext): Promise<boolean> {
        const { handler } = context;
        const required = this.reflector.get<boolean>('required', handler);
        const tokenType = this.reflector.get<boolean>('tokenType', handler);

        if (!required) return true;

        const jwt: string = SessionService.getTokenFromHeaders(req.headers);
        const parsedToken = await SessionService.verifyAndDecodeToken(jwt);

        if (!parsedToken) throw new BadRequestException(AUTH_HEADER_MISSING);

        const {
            sessionId,
            token,
            type,
        } = parsedToken;

        if (tokenType && tokenType !== type) throw new BadRequestException(INCORRECT_TOKEN_TYPE);

        const cookie: string = req.cookies['CSRF-TOKEN'];

        const session = await this.sessionService.validateSession(sessionId, type, token, cookie);

        if (session.hasValidId && !session.isValidSession) this.sessionService.removeSession(sessionId);

        if (!session.isValidSession) throw new UnauthorizedException(INVALID_SESSION_TOKENS);

        req.session = {
            id: sessionId,
            type,
            member: session.memberId,
        };

        return true;
    }
}