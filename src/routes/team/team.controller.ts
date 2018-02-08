import { Controller, Get, Param } from '@nestjs/common';

import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {

    constructor(
        private readonly teamService: TeamService,
    ) {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.teamService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param() params,
    ): Promise<any> {
        return this.teamService.findOne(params.id);
    }

    @Get(':id/games')
    async findGamesByTeam(
        @Param() params,
    ): Promise<any> {
        return this.teamService.findOne(params.id, { games: true });
    }
}