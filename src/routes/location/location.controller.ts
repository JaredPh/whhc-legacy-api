import { Controller, Get, Param } from '@nestjs/common';

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
    ): Promise<LocationResponse> {
        return new LocationResponse(await this.locationService.findOne(id));
    }
}