import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../utils/database/database.module';

import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { teamProviders } from './team.providers';

@Module({
    controllers: [
        TeamController,
    ],
    imports: [
        DatabaseModule,
    ],
    components: [
        TeamService,
        ...teamProviders,
    ],
})
export class TeamModule {}
