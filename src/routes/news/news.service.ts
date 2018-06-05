import { Component } from '@nestjs/common';
import { Repository, LessThan, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { News } from './news.entity';

@Component()
export class NewsService {

    constructor(
        @InjectRepository(News) private readonly newsRepository: Repository<News>,
    ) {}

    public async find(queryParams: any = {}): Promise<News[]> {

        const {
            count,
            exclude,
            skip,
        } = queryParams;

        const now = new Date().toJSON();

        const where: any = {
            date: LessThan(now),
        };

        if (exclude) {
            where.id = Not(exclude);
        }

        return await this.newsRepository.find({
            where,
            skip,
            take: count,
            order: {
              date: 'DESC',
            },
        });
    }
}
