import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './games.entity';

@Module({
    controllers: [
    ],
    components: [
    ],
    imports: [
        TypeOrmModule.forFeature([Game]),
    ],
})
export class GamesModule {}
