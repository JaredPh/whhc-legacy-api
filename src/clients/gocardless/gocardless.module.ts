import { Module } from '@nestjs/common';

import { GocardlessService } from './gocardless.service';

@Module({
    components: [
        GocardlessService,
    ],
    exports: [
        GocardlessService,
    ],
})
export class GocardlessModule {}
