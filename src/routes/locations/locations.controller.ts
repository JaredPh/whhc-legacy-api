import { Controller, Get, Param, Query } from '@nestjs/common';

import { LocationsService } from './locations.service';
import { LocationResult } from './locations.models';
import { LocationsTransportResponse } from './locations.interfaces';

@Controller('locations')
export class LocationsController {

    constructor(
        private readonly locationsService: LocationsService,
    ) {}

    @Get(':id')
    async getLocation(
        @Param('id') id: number,
    ): Promise<any> {
        const location = new LocationResult(await this.locationsService.findOne(id));

        return { results: [ location ] };
    }

    @Get(':id/transport')
    async getTransport(
        @Param('id') id: number,
        @Query('start') start?: string,
    ): Promise<LocationsTransportResponse> {
        const location = new LocationResult(await this.locationsService.findOne(id));

        const transport = await this.locationsService.getTransport(location, start);

        return { results: [ transport ] };
    }
}
