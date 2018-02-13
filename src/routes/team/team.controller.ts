import { Controller, Get, Param } from '@nestjs/common';

import { TeamService } from './team.service';
import { TeamResponse } from './team.models';

@Controller('teams')
export class TeamController {

    constructor(
        private readonly teamService: TeamService,
    ) {}

    @Get()
    async findAll(): Promise<TeamResponse> {
        return new TeamResponse(await this.teamService.findAll());
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
    ): Promise<TeamResponse> {
        return new TeamResponse(await this.teamService.findOne(id));
    }
}
