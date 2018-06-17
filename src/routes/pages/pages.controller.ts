import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { PagesService } from './pages.service';
import { PagesResponse } from './pages.interfaces';
import { PageResult, PageTree } from './pages.models';

@Controller('pages')
export class PagesController {

    constructor(
        private readonly pagesService: PagesService,
    ) {}

    @Get(':slug')
    async getPage(
        @Param('slug') slug: string,
    ): Promise<PagesResponse> {
        const result = await this.pagesService.findOne(slug, { ancestors: true });

        if (result) {
            const page = new PageResult(result);

            const origin = page.path.split('/')[1];

            const tree = new PageTree(await this.pagesService.findOne(origin, {descendants: true}));

            return {
                results: {
                    pages: [page],
                    trees: [tree],
                },
            };

        } else {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }
}
