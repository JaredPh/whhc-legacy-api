import { Controller, Get } from '@nestjs/common';

import { TagsService } from './tags.service';
import { TagsResponse } from './tags.interfaces';
import { TagResult } from './tags.models';

@Controller('images')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService,
    ) {}

    @Get()
    async getAllTags(
    ): Promise<TagsResponse> {
        const tags = (await this.tagsService.findAll())
            .map(t => new TagResult(t));

        return { results: tags };
    }
}
