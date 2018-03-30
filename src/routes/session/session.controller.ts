import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Request,
    Session,
    UnauthorizedException,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';

import { SessionService } from './session.service';

import { SessionRequest } from './session.models';
import { SessionTokenResponse } from './session.interfaces';
import { Authorised, Token } from './session.decorators';
import { SessionGuard } from './session.guard';

import { INVALID_CREDENTIALS } from '../../utils/errors/error.messages';

@Controller('session')
@UseGuards(SessionGuard)
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
        @Request() req: any,
        @Body(new ValidationPipe()) loginRequest: SessionRequest,
    ): Promise<SessionTokenResponse> {
        const {
            email,
            password,
        } = loginRequest;

        const loginResult = await this.sessionService.loginWithPassword(email, password);

        if (!loginResult) throw new UnauthorizedException(INVALID_CREDENTIALS);

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
    @Authorised()
    @Token('refresh')
    async refresh(
        @Session() session: any, // todo: add type
    ): Promise<SessionTokenResponse> {

        const {
            accessToken,
            refreshToken,
        } = await this.sessionService.refreshTokens(session.id);

        return {
            accessToken,
            refreshToken,
        };
    }
}
