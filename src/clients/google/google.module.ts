import { Module } from '@nestjs/common';

import { GoogleMapsService } from './google-maps.service';

@Module({
    components: [
        GoogleMapsService,
    ],
    exports: [
        GoogleMapsService,
    ],
})
export class GoogleModule {}
