import { Body, Controller, Inject, Post, Request, ValidationPipe } from '@nestjs/common';

import { SessionService } from './session.service';

import { LoginRequest } from './models/login-request.model';
import { LoginResponse } from './models/login.interfaces';

@Controller('session')
export class SessionController {

    /**
     * @todo Istanbul - remove any when branch bug is resolved
     * @see https://github.com/istanbuljs/istanbuljs/issues/70
     */
    constructor(
        @Inject(SessionService) private readonly sessionService: SessionService | any,
    ) {}

    /**
     * @todo Istanbul - remove any when branch bug is resolved
     * @see https://github.com/istanbuljs/istanbuljs/issues/70
     */
    @Post()
    async login(
        @Request() req: Request | any,
        @Body(new ValidationPipe()) loginRequest: LoginRequest | any,
    ): Promise<LoginResponse> {
        const {
            email,
            password,
        } = loginRequest;

        const {
            accessToken,
            refreshToken,
            cookieToken,
        } = await this.sessionService.loginWithPassword(email, password);

        // todo: look at secure cookies in prod
        req.res.cookie('CSRF-TOKEN', cookieToken, { httpOnly: true, secure: false });

        return {
            accessToken,
            refreshToken,
        };
    }
}
