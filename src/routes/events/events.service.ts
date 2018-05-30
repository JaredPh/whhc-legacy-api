import { Component } from '@nestjs/common';
import { Repository, MoreThan, LessThan, Equal, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from './events.entity';
import { EventResult } from './events.models';

@Component()
export class EventsService {

    constructor(
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    ) {}

    public async findAll(queryParams: any): Promise<EventResult[]> {

        const {
            count,
            exclude,
            future,
            past,
            skip,
        } = queryParams;

        const where: any = {};

        if (exclude) {
            where.id = Not(exclude);
        }

        if (past || future) {
            const now = new Date().toJSON();

            if (past === 'true') {
                where.start = LessThan(now);
            } else if (future === 'true') {
                where.start = MoreThan(now);
            }
        }

        return (await this.eventRepository.find({
            where,
            skip,
            take: count,
            order: {
              start: (past) ? 'DESC' : 'ASC',
            },
        })).map(e => new EventResult(e));
    }

    public async findOne(slug: string): Promise<EventResult> {
        return new EventResult(await this.eventRepository.findOne(slug));
    }
}
