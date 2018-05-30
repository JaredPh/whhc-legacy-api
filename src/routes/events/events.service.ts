import { Component } from '@nestjs/common';
import { Repository, MoreThan, LessThan, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from './events.entity';

@Component()
export class EventsService {

    constructor(
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    ) {}

    public async find(queryParams: any = {}): Promise<Event[]> {

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

            if (past === 'true' || future === 'false') {
                where.start = LessThan(now);
            } else if (past === 'false' || future === 'true') {
                where.start = MoreThan(now);
            }
        }

        return await this.eventRepository.find({
            where,
            skip,
            take: count,
            order: {
              start: (past) ? 'DESC' : 'ASC',
            },
        });
    }

    public async findOne(slug: string): Promise<Event> {
        return await this.eventRepository.findOne(slug);
    }
}
