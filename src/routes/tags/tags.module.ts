import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './tags.entity';

@Module({
    controllers: [
        TagsController,
    ],
    components: [
        TagsService,
    ],
    imports: [
        TypeOrmModule.forFeature([Tag]),
    ],
})
export class TagsModule {}
