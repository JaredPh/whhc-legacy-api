import { Controller, Get } from '@nestjs/common';

import { LocationsService } from './locations.service';
import { LocationsResponse} from './locations.interfaces';
import { LocationResult } from './locations.models';

@Controller('images')
export class LocationsController {

    constructor(
        private readonly locationsService: LocationsService,
    ) {}

    @Get('admin')
    async getAllLocations(
    ): Promise<LocationsResponse> {
        const locations = (await this.locationsService.findAll())
            .map(l => new LocationResult(l));

        return { results: locations };
    }
}
