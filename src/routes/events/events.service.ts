import { Component } from '@nestjs/common';
import { Repository, MoreThan, LessThan} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from './events.entity';
import { EventResult } from './events.models';

@Component()
export class EventsService {

    constructor(
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    ) {}

    public async findAll(count: number, past: boolean = false): Promise<EventResult[]> {

        const now = new Date().toJSON();
        let where;

        if (past) {
            where = {
                start: LessThan(now),
            };
        } else {
            where = {
                start: MoreThan(now),
            };
        }

        return (await this.eventRepository.find({
            where,
            take: count,
            order: {
                start: (past) ? 'DESC' : 'ASC',
            },
        })).map(e => new EventResult(e));
    }
}
