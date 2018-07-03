import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './teams.entity';
import { Club } from './clubs.entity';

@Module({
    controllers: [
    ],
    components: [
    ],
    imports: [
        TypeOrmModule.forFeature([Club, Team]),
    ],
})
export class TeamsModule {}
