import { Controller, Get, Param, Patch, Request, HttpCode } from '@nestjs/common';

import { UserRoles } from '../../utils/auth/auth.decorators';

import { NewsService } from './news.service';
import { NewsResponse } from './news.interfaces';
import { NewsResult } from './news.models';

@Controller('news')
export class NewsController {

    constructor(
        private readonly newsService: NewsService,
    ) {}

    @Get()
    async getNewsArticles(
        @Request() req: any,
    ): Promise<NewsResponse> {
        const queryParams = req.query;

        let news = (await this.newsService.find(queryParams))
            .map(n => new NewsResult(n));

        if (queryParams.tag) {
            news = news.filter(n => n.tags.find(t => t.name === queryParams.tag));
        }

        if (queryParams.photos === 'true') {
            news = news.filter(n => n.photos.length > 0);
        }

        return { results: news };
    }

    @Get(':slug')
    async getNewsArticle(
        @Param('slug') slug: any,
    ): Promise<NewsResponse> {
        const news = [ new NewsResult(await this.newsService.findOne(slug)) ];

        return { results: news };
    }

    async setSimilarNews(): Promise<void> {
        const news = await this.newsService.find({});

        await news.forEach(async (n) => {
            const article = this.newsService.setSimilar(n, news, 4);
            await this.newsService.save(article);
        });
    }
}
