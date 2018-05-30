import { Controller, Get, Param, Request } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';

@Controller('events')
export class EventsController {

    constructor(
        private readonly eventsService: EventsService,
    ) {}

    @Get()
    async getAllEvents(
        @Request() req: any,
    ): Promise<EventsResponse> {
        const queryParams = req.query;

        const events = (await this.eventsService.findAll(queryParams))
            .sort((a, b) => a.start.localeCompare(b.start));

        return { results: events };
    }

    @Get(':slug')
    async getEvent(
        @Param('slug') slug: any,
    ): Promise<EventsResponse> {
        const events = [ await this.eventsService.findOne(slug) ];

        return { results: events };
    }
}
