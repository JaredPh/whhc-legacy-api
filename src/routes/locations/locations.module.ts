import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './locations.entity';

@Module({
    controllers: [
        LocationsController,
    ],
    components: [
        LocationsService,
    ],
    imports: [
        TypeOrmModule.forFeature([Location]),
    ],
})
export class LocationsModule {}
