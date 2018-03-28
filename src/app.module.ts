import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { MembersModule } from './routes/members/members.module';
import { SessionModule } from './routes/session/session.module';

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
