import { Component } from '@nestjs/common';
import { Repository, LessThan, In, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { News } from './news.entity';
import { Tag } from '../tags/tags.entity';
import * as moment from 'moment';

@Component()
export class NewsService {

    constructor(
        @InjectRepository(News) private readonly newsRepository: Repository<News>,
    ) {}

    public async find(queryParams: any = {}): Promise<News[]> {

        const {
            count,
            include,
            exclude,
            skip,
        } = queryParams;

        const now = new Date().toJSON();

        const where: any = {
            date: LessThan(now),
        };

        if (include) {
            where.id = In(include.split(','));
        }

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

    public async findOne(slug: string): Promise<News> {
        return await this.newsRepository.findOne(slug);
    }

    public async save(article: News): Promise<News> {
        return await this.newsRepository.save(article);
    }

    public setSimilar(article: News, articles: News[], count: number = 4): News {

        const getTagScore = (articleTags: Tag[], similarTags: Tag[]): number => {
            const tagsToSearchFor: string[] = articleTags.map(t => t.id);

            const matchCount: number = similarTags.reduce(
                (total: number, tag) => (tagsToSearchFor.indexOf(tag.id) >= 0) ? total + 1 : total,
                0,
            );

            const totalCount = tagsToSearchFor.length;

            return Math.max(0.05, Math.pow(matchCount / totalCount, 2));
        };

        const getDateScore = (date: Date): number => {
            const now = moment();
            const then = moment(date);
            const days = now.diff(then, 'days');

            return Math.max(0.05, Math.pow(1 / days, 0.4));
        };

        article.similar = articles
            .filter(n => n.id !== article.id)
            .map((n) => {
                return {
                    id: n.id,
                    score: getTagScore(article.tags, n.tags) * getDateScore(n.date),
                    date: n.date,
                };
            })
            .sort((a, b) =>  b.score - a.score)
            .slice(0, count)
            .sort((a, b) =>  (b.date > a.date) ? 1 : -1)
            .map(t => t.id);

        return article;
    }
}
