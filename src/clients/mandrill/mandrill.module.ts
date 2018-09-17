import { Module } from '@nestjs/common';

import { MandrillService } from './mandrill.service';

@Module({
    components: [
        MandrillService,
    ],
    exports: [
        MandrillService,
    ],
})
export class MandrillModule {}
