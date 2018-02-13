import { Controller, Get, HttpStatus, NotFoundException, Param, Request, Req } from '@nestjs/common';

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
        @Req() req: Request,
    ): Promise<TeamResponse> {
        const result = await this.teamService.findOne(id);

        if (!result) throw new NotFoundException(`Cannot GET ${req.originalUrl}`, HttpStatus.NOT_FOUND);

        return new TeamResponse(result);
    }
}
