import { Controller, Get, HttpStatus, NotFoundException, Param, Request, Req } from '@nestjs/common';

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
        @Req() req: Request,
    ): Promise<ClubResponse> {
        const result = await this.clubService.findOne(id);

        if (!result) throw new NotFoundException(`Cannot GET ${req.originalUrl}`, HttpStatus.NOT_FOUND);

        return new ClubResponse(result);
    }
}
