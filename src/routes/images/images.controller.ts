import { Controller, Get } from '@nestjs/common';

import { UserRoles } from '../../utils/auth/auth.decorators';

import { ImagesService } from './images.service';
import { ImagesResponse } from './images.interfaces';
import { ImageResult } from './images.models';

@Controller('images')
export class ImagesController {

    constructor(
        private readonly imagesService: ImagesService,
    ) {}

    @Get()
    @UserRoles(['admin'])
    async getAllImages(
    ): Promise<ImagesResponse> {
        const images = (await this.imagesService.findAll())
            .map(i => new ImageResult(i));

        return { results: images };
    }
}
