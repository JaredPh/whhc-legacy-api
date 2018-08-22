import { Controller, Get, Param, Request } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';
import { EventResult } from './events.models';
import { LocationsService } from '../locations/locations.service';
import { Tag } from '../tags/tags.entity';

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

        let events: EventResult[] = (await this.eventsService.find(queryParams)).map(e => new EventResult(e));

        if (queryParams && queryParams.tag) {
            events = events.filter(n => n.tags.find((t: Tag) => t.id === queryParams.tag));
        }

        events = events.map(e => {
            e.location.setMap(this.locationsService.getMap(e.location));
            return e;
        });

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
