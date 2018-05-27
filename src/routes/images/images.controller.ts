import { Controller, Get } from '@nestjs/common';

import { ImagesService } from './images.service';
// import { ImagesResponse } from './images.interfaces';

@Controller('images')
export class ImagesController {

    constructor(
        private readonly imagesService: ImagesService,
    ) {}

    // @Get()
    // async getAllMembers(
    // ): Promise<ImagesResponse> {
    //     const images = await this.imagesService.findAll();
    //
    //     return { results: images };
    // }
}
