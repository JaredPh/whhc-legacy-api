import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './utils/auth/auth.module';
import { EventsModule } from './routes/events/events.module';
import { ImagesModule } from './routes/images/images.module';
import { LocationsModule } from './routes/locations/locations.module';
import { MembersModule } from './routes/members/members.module';
import { TagsModule } from './routes/tags/tags.module';
import { NewsModule } from './routes/news/news.module';

@Module({
  imports: [
      AuthModule,
      EventsModule,
      ImagesModule,
      LocationsModule,
      MembersModule,
      NewsModule,
      TagsModule,
      TypeOrmModule.forRoot(),
  ],
})
export class ApplicationModule {}
