import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as dotEnv from 'dotenv-safe';

dotEnv.config();

const instance = express();
instance.use(compression());
instance.use(helmet());
instance.use(cookieParser());

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create(ApplicationModule, instance);
	await app.listen(3000);
};

bootstrap();
