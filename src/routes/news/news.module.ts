import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News } from './news.entity';

@Module({
    controllers: [
        NewsController,
    ],
    components: [
        NewsService,
    ],
    imports: [
        TypeOrmModule.forFeature([News]),
    ],
})
export class NewsModule {}
