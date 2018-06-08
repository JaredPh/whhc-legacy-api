import { NestFactory } from '@nestjs/core';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as cron from 'node-cron';
import * as dotEnv from 'dotenv-safe';
import * as express from 'express';
import * as helmet from 'helmet';

import { ApplicationModule } from './app.module';
import { AuthModule } from './utils/auth/auth.module';
import { AuthGuard } from './utils/auth/auth.guard';
import {NewsModule} from "./routes/news/news.module";
import {NewsController} from "./routes/news/news.controller";

dotEnv.config();

const instance = express();
instance.use(compression());
instance.use(helmet());
instance.use(cookieParser());
instance.use(cors({
    origin: process.env.CORS_ORIGINS.split('|'),
}));

const bootstrap = async (): Promise<void> => {

    const app = await NestFactory.create(ApplicationModule, instance);

    const authGuard = app.select(AuthModule).get<AuthGuard>(AuthGuard);
    app.useGlobalGuards(authGuard);

    await app.listen(3000);

    cron.schedule('0 * * * *', () => {
        const newsController = app.select(NewsModule).get(NewsController);
        newsController.setSimilarNews();
    });
};

bootstrap();
