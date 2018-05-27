import {Controller, Get, Query} from "@nestjs/common";

import { EventsService } from './events.service';
import { EventsResponse } from './events.interfaces';

@Controller('events')
export class EventsController {

    constructor(
        private readonly eventsService: EventsService,
    ) {}

    @Get()
    async getAllMembers(
        @Query('count') count: string,
        @Query('past') past: string,
    ): Promise<EventsResponse> {
        const events = (await this.eventsService.findAll(+count, past === 'true'))
            .sort((a, b) => a.start.localeCompare(b.start));

        return { results: events };
    }
}
