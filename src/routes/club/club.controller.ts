import { Controller, Get, Param } from '@nestjs/common';

import { ClubService } from './club.service';
import { ClubResponse } from './club.models';

@Controller('clubs')
export class ClubController {

    constructor(
        private readonly clubService: ClubService,
    ) {}

    @Get()
    async findAll(): Promise<ClubResponse> {
        return new ClubResponse(await this.clubService.findAll());
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
    ): Promise<ClubResponse> {
        return new ClubResponse(await this.clubService.findOne(id));
    }
}
