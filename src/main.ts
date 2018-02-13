import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

import * as express from 'express';
import * as compression from 'compression';
import * as helmet from 'helmet';

const instance = express();
instance.use(compression());
instance.use(helmet());

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create(ApplicationModule, instance);
	await app.listen(3000);
};

bootstrap();
