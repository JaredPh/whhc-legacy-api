import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './events.entity';

@Module({
    controllers: [
        EventsController,
    ],
    components: [
        EventsService,
    ],
    imports: [
        TypeOrmModule.forFeature([Event]),
    ],
})
export class EventsModule {}
