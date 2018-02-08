import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../utils/database/database.module';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { locationProviders } from './location.providers';

@Module({
    controllers: [
        LocationController,
    ],
    imports: [
        DatabaseModule,
    ],
    components: [
        LocationService,
        ...locationProviders,
    ],
})
export class LocationModule {}
