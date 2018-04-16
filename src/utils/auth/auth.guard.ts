import {
    Guard, CanActivate, ExecutionContext, Inject, BadRequestException, UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthService } from './auth.service';
import { errorMessages } from '../errors/error.messages';

@Guard()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) {}

    async canActivate(req, context: ExecutionContext): Promise<boolean> {

        const {handler} = context;
        const lamdaEvent = this.reflector.get<string>('lamdaEvent', handler);

        if (lamdaEvent) {
            return (req.query.key && req.body.iv)
                ? this.authService.verifyEncryptedKey(`${req.body.iv}:${req.query.key}`, lamdaEvent)
                : false;

        } else {
            const routeRoles = this.reflector.get<string[]>('roles', handler);

            const userId = await this.authService.verifyToken(req);

            if (!userId) {
                if (routeRoles) return false;
                return true;
            }
            const user = await this.authService.getMember(userId);

            if (!user) throw new InternalServerErrorException(errorMessages.DATABASE_RESOURSE_NOT_FOUND);

            req.user = user;

            if (!routeRoles) return true;

            const userRoles = user.roles.map(role => role.id);

            const matchingRoles = routeRoles.filter(r => userRoles.indexOf(r) >= 0);

            if (matchingRoles.length === 0) return false;

            return true;
        }
    }
}