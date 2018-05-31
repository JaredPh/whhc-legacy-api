import { Controller, Get, Param, Request } from '@nestjs/common';

import { NewsService } from './news.service';
import { NewsResponse } from './news.interfaces';
import { NewsMetaResult, NewsResult } from './news.models';

@Controller('news')
export class NewsController {

    constructor(
        private readonly newsService: NewsService,
    ) {}

    @Get()
    async getAllNews(
        @Request() req: any,
    ): Promise<NewsResponse> {
        const queryParams = req.query;

        const similarNews = (await this.newsService.find())
            .map(n => new NewsMetaResult(n));

        const news = (await this.newsService.find(queryParams))
            .map(n => new NewsResult(n, similarNews));

        return { results: news };
    }

    @Get(':slug')
    async getNews(
        @Param('slug') slug: any,
    ): Promise<NewsResponse> {

        const similarNews = (await this.newsService.find())
            .map(n => new NewsMetaResult(n));

        const news = [ new NewsResult(await this.newsService.findOne(slug), similarNews) ];

        return { results: news };
    }
}
