import { ReflectMetadata } from '@nestjs/common';

export const Authorise = (type: string = 'access') => ReflectMetadata('tokenType', type);
