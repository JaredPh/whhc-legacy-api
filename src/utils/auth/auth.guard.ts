import { Guard, CanActivate, ExecutionContext, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { errorMessages } from '../../utils/errors/error.messages';
import { AuthService } from './auth.service';

@Guard()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) {}

    async canActivate(req, context: ExecutionContext): Promise<boolean> {

        const { handler } = context;
        const routeRoles = this.reflector.get<string[]>('roles', handler);

        const tokenUser = await this.authService.verifyToken(req.headers.authorization);

        if (routeRoles && !tokenUser) return false;

        const user = await this.authService.getMember(tokenUser);
        req.user = user;

        console.log('user', '=>', req.user);

        if (!routeRoles) return true;

        const userRoles = user.roles.map(role => role.id);

        const matchingRoles = routeRoles.filter(r => userRoles.indexOf(r) >= 0);

        if (matchingRoles.length === 0) return false;

        return true;
    }
}