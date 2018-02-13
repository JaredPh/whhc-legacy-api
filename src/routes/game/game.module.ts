import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from './game.entity';

@Module({
    controllers: [
        GameController,
    ],
    imports: [
        TypeOrmModule.forFeature([Game]),
    ],
    components: [
        GameService,
    ],
    exports: [
        GameService,
    ],
})
export class GameModule {}
