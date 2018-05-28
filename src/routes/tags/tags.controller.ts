import { Controller, Get } from '@nestjs/common';

import { TagsService } from './tags.service';
// import { TagsResponse } from './tags.interfaces';

@Controller('images')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService,
    ) {}

    // @Get()
    // async getAllTags(
    // ): Promise<TagsResponse> {
    //     const tags = await this.tagsService.findAll();
    //
    //     return { results: tags };
    // }
}
