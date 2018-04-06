import {
    Guard,
    CanActivate,
    ExecutionContext,
    Inject,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SessionService } from './session.service';
import { errorMessages } from '../../utils/errors/error.messages';

@Guard()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject('SessionService') private readonly sessionService: SessionService,
    ) {}

    async canActivate(req, context: ExecutionContext): Promise<boolean> {
        const { handler } = context;
        const requiredTokenType = this.reflector.get<string>('tokenType', handler);

        const {
            session,
            token,
        } = await this.sessionService.loadSession(req);

        /* if token is invalid or missing but required */
        if (token.type === 'invalid' && requiredTokenType) {
            throw new UnauthorizedException(errorMessages.AUTH_HEADER_MISSING);
        }

        /* if token is readable but invalid destroy session */
        if (session && !token.verified) {
            await this.sessionService.removeSession(session.id);
            throw new UnauthorizedException(errorMessages.INVALID_SESSION_TOKEN);
        }

        if (!requiredTokenType || requiredTokenType === token.type) {
            req.session = session;
            return true;
        } else {
            throw new BadRequestException(errorMessages.INCORRECT_TOKEN_TYPE);
        }
    }
}