import { Body, Controller, Post, Request, ValidationPipe } from '@nestjs/common';

import { SessionService } from './session.service';

import { LoginRequest } from './models/login-request.model';
import { LoginResponse } from './models/login-response.interface';

@Controller('session')
export class SessionController {

    constructor(
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    async login(
        @Request() req: any,
        @Body(new ValidationPipe()) loginRequest: LoginRequest,
    ): Promise<LoginResponse> {
        const { email, password } = loginRequest;

        const { cookie, response } = await this.sessionService.loginWithPassword(email, password);

        // todo: look at secure cookies in prod
        req.res.cookie('CSRF-TOKEN', cookie, { httpOnly: true, secure: false });

        return response;
    }
}
