import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersModule } from './routes/members/members.module';
import { SessionModule } from './routes/session/session.module';

import { AppController } from './app.controller';

@Module({
  imports: [
      MembersModule,
      SessionModule,
      TypeOrmModule.forRoot(),
  ],
  controllers: [
      AppController,
  ],
  components: [],
})
export class ApplicationModule {}
