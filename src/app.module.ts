import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClubModule } from './routes/club/club.module';
import { TeamModule } from './routes/team/team.module';
import { LocationModule } from './routes/location/location.module';
import { GameModule } from './routes/game/game.module';

@Module({
  imports: [
      ClubModule,
      GameModule,
      LocationModule,
      TeamModule,
  ],
  controllers: [
      AppController,
  ],
  components: [],
})
export class ApplicationModule {}
