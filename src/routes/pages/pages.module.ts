import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { Page } from './pages.entity';

@Module({
    controllers: [
        PagesController,
    ],
    components: [
        PagesService,
    ],
    imports: [
        TypeOrmModule.forFeature([Page]),
    ],
})
export class PagesModule {}
