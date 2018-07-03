import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './games.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
    controllers: [
        GamesController,
    ],
    components: [
        GamesService,
    ],
    imports: [
        TypeOrmModule.forFeature([Game]),
    ],
})
export class GamesModule {}
