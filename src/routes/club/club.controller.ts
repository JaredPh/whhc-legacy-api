import { Controller, Get, Param } from '@nestjs/common';

import { ClubService } from './club.service';
import { ClubResponse } from './models/ClubResponse.model';

@Controller('clubs')
export class ClubController {

    constructor(
        private readonly clubService: ClubService,
    ) {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.clubService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param() params,
    ): Promise<ClubResponse> {
        return this.clubService.findOne(params.id);
    }
}