import { Controller, Get, Param, Request } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';
import { EventResult } from './events.models';
import { LocationsService } from '../locations/locations.service';

@Controller('events')
export class EventsController {

    constructor(
        private readonly eventsService: EventsService,
        private readonly locationsService: LocationsService,
    ) {}

    @Get()
    async getAllEvents(
        @Request() req: any,
    ): Promise<EventsResponse> {
        const queryParams = req.query;

        let events = (await this.eventsService.find(queryParams))
            .map((e) => {
                const event = new EventResult(e);
                event.location.setMap(this.locationsService.getMap(event.location));
                return event;
            });

        if (queryParams.tag) {
            events = events.filter(n => n.tags.find(t => t.name === queryParams.tag));
        }

        return { results: events };
    }

    @Get(':slug')
    async getEvent(
        @Param('slug') slug: string,
    ): Promise<EventsResponse> {
        const event = new EventResult(await this.eventsService.findOne(slug));

        event.location.setMap(this.locationsService.getMap(event.location));

        return { results: [event] };
    }
}
