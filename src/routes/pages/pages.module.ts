import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { Page } from './pages.entity';
import { LocationsModule } from '../locations/locations.module';

@Module({
    controllers: [
        PagesController,
    ],
    components: [
        PagesService,
    ],
    imports: [
        LocationsModule,
        TypeOrmModule.forFeature([Page]),
    ],
})
export class PagesModule {}
