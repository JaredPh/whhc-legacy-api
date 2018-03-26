import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

@Module({
  imports: [
      TypeOrmModule.forRoot(),
  ],
  controllers: [
      AppController,
  ],
  components: [],
})
export class ApplicationModule {}
