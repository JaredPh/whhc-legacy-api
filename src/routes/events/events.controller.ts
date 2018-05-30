import { Controller, Get, Param, Request } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';
import { EventResult } from './events.models';

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

        const events = (await this.eventsService.find(queryParams))
            .map(e => new EventResult(e));

        return { results: events };
    }

    @Get(':slug')
    async getEvent(
        @Param('slug') slug: any,
    ): Promise<EventsResponse> {
        const events = [ new EventResult(await this.eventsService.findOne(slug)) ];

        return { results: events };
    }
}
