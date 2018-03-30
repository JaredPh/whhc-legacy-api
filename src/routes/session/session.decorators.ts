import { ReflectMetadata } from '@nestjs/common';

export const Authorised = () => ReflectMetadata('required', true);

export const Token = (type: string) => ReflectMetadata('tokenType', type);