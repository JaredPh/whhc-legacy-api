import { Body, Controller, Post, Request, ValidationPipe } from '@nestjs/common';

import { SessionService } from './session.service';

import { LoginRequest } from './models/login-request.model';
import { LoginResponse } from './models/login.interfaces';

@Controller('session')
export class SessionController {

    constructor(
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    async login(
        @Request() req: Request,
        @Body(new ValidationPipe()) loginRequest: LoginRequest,
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
