import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from './events.entity';
import { EventResult } from './events.models';

@Component()
export class EventsService {

    constructor(
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    ) {}

    public async findAll(): Promise<EventResult[]> {
        return (await this.eventRepository.find())
            .map(e => new EventResult(e));
    }
}
