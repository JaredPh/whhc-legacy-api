import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location } from './location.entity';

@Module({
    controllers: [
        LocationController,
    ],
    imports: [
        TypeOrmModule.forFeature([Location]),
    ],
    components: [
        LocationService,
    ],
})
export class LocationModule {}
