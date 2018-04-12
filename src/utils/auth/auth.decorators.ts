import { createRouteParamDecorator, ReflectMetadata } from '@nestjs/common';

export const User = createRouteParamDecorator((data, req) => req.user);

export const UserRoles = (roles: string[] = ['member']) => ReflectMetadata('roles', roles);

export const LamdaEvent = (event: string) => ReflectMetadata('lamdaEvent', event);
