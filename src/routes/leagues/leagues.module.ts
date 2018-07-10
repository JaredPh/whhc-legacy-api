import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { League } from './leagues.entity';

@Module({
    controllers: [
    ],
    components: [
    ],
    imports: [
        TypeOrmModule.forFeature([League]),
    ],
})
export class LeaguesModule {}
