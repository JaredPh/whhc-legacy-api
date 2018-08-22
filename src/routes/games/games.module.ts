import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './games.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { LocationsModule } from '../locations/locations.module';

@Module({
    controllers: [
        GamesController,
    ],
    components: [
        GamesService,
    ],
    imports: [
        LocationsModule,
        TypeOrmModule.forFeature([Game]),
    ],
    exports: [
        GamesService,
    ],
})
export class GamesModule {}
