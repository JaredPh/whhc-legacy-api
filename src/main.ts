import { NestFactory } from '@nestjs/core';

import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as dotEnv from 'dotenv-safe';

import { ApplicationModule } from './app.module';
import { AuthModule } from './utils/auth/auth.module';
import { AuthGuard } from './utils/auth/auth.guard';

dotEnv.config();

const instance = express();
instance.use(compression());
instance.use(helmet());
instance.use(cookieParser());

const bootstrap = async (): Promise<void> => {
    const app = await NestFactory.create(ApplicationModule, instance);

    const authGuard = app.select(AuthModule).get<AuthGuard>(AuthGuard);
    app.useGlobalGuards(authGuard);

    await app.listen(3000);
};

bootstrap();
