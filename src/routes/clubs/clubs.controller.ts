import { Controller, Get, Param } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsResponse } from './clubs.interfaces';

@Controller('clubs')
export class ClubsController {

    constructor(
        private readonly clubsService: ClubsService,
    ) {}

    @Get()
    async getClubs(
    ): Promise<ClubsResponse> {
        const clubs = await this.clubsService.find();

        return { results: clubs};
    }

    @Get(':id')
    async getClub(
        @Param('id') id: number,
    ): Promise<ClubsResponse> {
        const club = (await this.clubsService.findOne(id));

        return { results: [ club ]};
    }
}
