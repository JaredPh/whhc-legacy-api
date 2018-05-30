import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './images.entity';

@Module({
    controllers: [
        ImagesController,
    ],
    components: [
        ImagesService,
    ],
    imports: [
        TypeOrmModule.forFeature([Image]),
    ],
})
export class ImagesModule {}
