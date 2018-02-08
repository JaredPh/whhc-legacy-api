import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../utils/database/database.module';

import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { clubProviders } from './club.providers';
import { GameModule } from '../game/game.module';

@Module({
    controllers: [
        ClubController,
    ],
    imports: [
        DatabaseModule,
        GameModule,
    ],
    components: [
        ClubService,
        ...clubProviders,
    ],
})
export class ClubModule {}
