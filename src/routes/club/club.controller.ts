import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { ClubService } from './club.service';
import { ClubResponse } from './club.models';

@Controller('clubs')
export class ClubController {

    constructor(
        private readonly clubService: ClubService,
    ) {}

    @Get()
    async findAll(): Promise<ClubResponse> {
        const clubs = await this.clubService.findAll();
        return new ClubResponse(clubs);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
    ): Promise<ClubResponse> {
        const result = await this.clubService.findOne(id);

        if (!result) throw new NotFoundException();

        return new ClubResponse(result);
    }
}
