import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../utils/database/database.module';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { gameProviders } from './game.providers';

@Module({
    controllers: [
        GameController,
    ],
    imports: [
        DatabaseModule,
    ],
    components: [
        GameService,
        ...gameProviders,
    ],
    exports: [
        GameService,
    ],
})
export class GameModule {}
