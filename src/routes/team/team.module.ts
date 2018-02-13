import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './team.entity';

@Module({
    controllers: [
        TeamController,
    ],
    imports: [
        TypeOrmModule.forFeature([Team]),
    ],
    components: [
        TeamService,
    ],
})
export class TeamModule {}
