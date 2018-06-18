import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { PagesService } from './pages.service';
import { PagesResponse } from './pages.interfaces';
import { PageResult, PageSummaryResult, PageTree } from './pages.models';
import { LocationsService } from '../locations/locations.service';
import { LocationResult } from '../locations/locations.models';

@Controller('pages')
export class PagesController {

    constructor(
        private readonly pagesService: PagesService,
        private readonly locationsService: LocationsService,
    ) {}

    @Get()
    async getPageTree(): Promise<PagesResponse> {
        const results = await this.pagesService.findRoots();

        return { results: results.map(r => new PageTree(r)) };
    }

    @Get(':id')
    async getPage(
        @Param('id') id: number,
    ): Promise<PagesResponse> {
        const result = await this.pagesService.findOne(id);
        if (result) {
            const page = new PageResult(result);

            let location: LocationResult;

            if (result.type === 'location') {
                location = new LocationResult(await this.locationsService.findOne(result.reference));
                location.setMap(this.locationsService.getMap(location));
                page.setReference(location);
            }

            if (result.type === 'landing') {
                page.setReference(result.children
                    .sort(((a, b) => a.weight - b.weight))
                    .map(c => new PageSummaryResult(c)),
                );
            }

            return { results: [ page ] };
        } else {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }
}
