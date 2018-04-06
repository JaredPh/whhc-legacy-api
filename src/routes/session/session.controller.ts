import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Request,
    Session,
    UnauthorizedException,
    ValidationPipe,
} from '@nestjs/common';

import { SessionService } from './session.service';

import { SessionRequest } from './session.models';
import { ISessionTokenResponse } from './session.interfaces';
import { Authorise } from './session.decorators';

import { errorMessages } from '../../utils/errors/error.messages';
import { ESession } from './session.entity';

@Controller('session')
export class SessionController {

    constructor(
        @Inject(SessionService) private readonly sessionService: SessionService,
    ) {}

    @Post()
    async login(
        @Request() req: any,
        @Body(new ValidationPipe()) loginRequest: SessionRequest,
    ): Promise<ISessionTokenResponse> {
        const {
            email,
            password,
        } = loginRequest;

        const loginResult = await this.sessionService.loginWithPassword(email, password);

        if (!loginResult) throw new UnauthorizedException(errorMessages.INVALID_CREDENTIALS);

        const {
            accessToken,
            refreshToken,
            cookieToken,
        } = loginResult;

        // todo: look at secure cookies in prod
        req.res.cookie('CSRF-TOKEN', cookieToken, { httpOnly: true, secure: false });

        return {
            accessToken,
            refreshToken,
        };
    }

    @Get()

    @Authorise('refresh')
    async refresh(
        @Session() session: ESession,
    ): Promise<ISessionTokenResponse> {

        const {
            accessToken,
            refreshToken,
        } = await this.sessionService.refreshTokens(session);

        return {
            accessToken,
            refreshToken,
        };
    }
}
