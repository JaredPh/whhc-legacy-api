import { Controller, Get } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';

@Controller('events')
export class EventsController {

    constructor(
        private readonly eventsService: EventsService,
    ) {}

    @Get()
    async getAllMembers(
    ): Promise<EventsResponse> {
        const events = (await this.eventsService.findAll())
            .sort((a, b) => a.start.localeCompare(b.start));

        return { results: events };
    }
}
