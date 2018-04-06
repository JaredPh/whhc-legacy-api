import { NestFactory } from '@nestjs/core';

import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as dotEnv from 'dotenv-safe';

import { ApplicationModule } from './app.module';
import { SessionGuard } from './routes/session/session.guard';
import { SessionModule } from './routes/session/session.module';

dotEnv.config();

const instance = express();
instance.use(compression());
instance.use(helmet());
instance.use(cookieParser());

const bootstrap = async (): Promise<void> => {
    const app = await NestFactory.create(ApplicationModule, instance);

    const sessionGuard = app.select(SessionModule).get<SessionGuard>(SessionGuard);
    app.useGlobalGuards(sessionGuard);

    await app.listen(3000);
};

bootstrap();
