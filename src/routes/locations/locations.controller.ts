import { Controller, Get } from '@nestjs/common';

import { LocationsService } from './locations.service';
// import { LocationsResponse} from './locations.interfaces';

@Controller('images')
export class LocationsController {

    constructor(
        private readonly locationsService: LocationsService,
    ) {}

    // @Get()
    // async getAllMembers(
    // ): Promise<LocationsResponse> {
    //     const locations = await this.locationsService.findAll();
    //
    //     return { results: locations };
    // }
}
