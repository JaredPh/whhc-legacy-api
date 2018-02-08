import { Controller, Get} from '@nestjs/common';

import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {

    constructor(
        private readonly locationService: LocationService,
    ) {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.locationService.findAll();
    }
}