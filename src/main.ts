import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

import * as dotEnv from 'dotenv-safe';
import * as express from 'express';
import * as compression from 'compression';
import * as helmet from 'helmet';

dotEnv.load();

const instance = express();
instance.use(compression());
instance.use(helmet());

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, instance);
	await app.listen(3000);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
