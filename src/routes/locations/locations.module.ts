import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './locations.entity';

import { GoogleModule } from '../../clients/google/google.module';

@Module({
    controllers: [
        LocationsController,
    ],
    components: [
        LocationsService,
    ],
    imports: [
        GoogleModule,
        TypeOrmModule.forFeature([Location]),
    ],
    exports: [
        LocationsService,
    ],
})
export class LocationsModule {}
