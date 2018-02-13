import { Controller, Get, HttpStatus, NotFoundException, Param, Request, Req } from '@nestjs/common';

import { LocationService } from './location.service';
import { LocationResponse } from './location.models';

@Controller('locations')
export class LocationController {

    constructor(
        private readonly locationService: LocationService,
    ) {}

    @Get()
    async findAll(): Promise<LocationResponse> {
        return new LocationResponse(await this.locationService.findAll());
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<LocationResponse> {
        const result = await this.locationService.findOne(id);

        if (!result) throw new NotFoundException(`Cannot GET ${req.originalUrl}`, HttpStatus.NOT_FOUND);

        return new LocationResponse(result);
    }
}