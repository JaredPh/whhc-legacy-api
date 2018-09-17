import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './utils/auth/auth.module';
import { EventsModule } from './routes/events/events.module';
import { GamesModule } from './routes/games/games.module';
import { ImagesModule } from './routes/images/images.module';
import { LeaguesModule } from './routes/leagues/leagues.module';
import { LocationsModule } from './routes/locations/locations.module';
import { MembersModule } from './routes/members/members.module';
import { PagesModule } from './routes/pages/pages.module';
import { TagsModule } from './routes/tags/tags.module';
import { TeamsModule } from './routes/teams/teams.module';
import { NewsModule } from './routes/news/news.module';
import { ClubsModule } from './routes/clubs/clubs.module';
import { RegistrationsModule } from './routes/registrations/registrations.module';

@Module({
  imports: [
      AuthModule,
      ClubsModule,
      EventsModule,
      ImagesModule,
      GamesModule,
      LeaguesModule,
      LocationsModule,
      MembersModule,
      NewsModule,
      PagesModule,
      RegistrationsModule,
      TagsModule,
      TeamsModule,
      TypeOrmModule.forRoot(),
  ],
})
export class ApplicationModule {}
