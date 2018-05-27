import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './utils/auth/auth.module';
import { EventsModule } from './routes/events/events.module';
import { ImagesModule } from './routes/images/images.module';
import { MembersModule } from './routes/members/members.module';

@Module({
  imports: [
      AuthModule,
      EventsModule,
      ImagesModule,
      MembersModule,
      TypeOrmModule.forRoot(),
  ],
})
export class ApplicationModule {}
