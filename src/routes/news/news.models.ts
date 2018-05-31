import { News } from './news.entity';

import { ImageResult } from '../images/images.models';
import { MemberResult } from '../members/members.models';
import { TagResult } from '../tags/tags.models';

import * as moment from 'moment';

const getTagScore = (articleTags: TagResult[], similarTags: TagResult[]): number => {
    const tagsToSearchFor: string[] = articleTags.map(t => t.name);
    const matchCount: number = similarTags.reduce(
        (total: number, tag) => (tagsToSearchFor.indexOf(tag.name) >= 0) ? total + 1 : total,
        0,
    );
    const totalCount = tagsToSearchFor.length;

    return Math.max(0.05, Math.pow(matchCount / totalCount, 2));
};

const getDateScore = (date: string): number => {
    const now = moment();
    const then = moment(date);
    const days = now.diff(then, 'days');

    return Math.max(0.05, Math.pow(1 / days, 0.4));

};

export class NewsMetaResult {
    slug: string;
    date: string;
    tags: any;

    constructor(data: News) {
        this.slug = data.id;

        this.date = data.date.toJSON();

        this.tags = data.tags
            .map(t => new TagResult(t))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
}

export class NewsResult extends NewsMetaResult {
    thumb: ImageResult;
    background: ImageResult;
    photos: ImageResult[];
    video: string;

    heading: string;
    body: string;

    author: MemberResult;

    similar: string[];

    constructor(data: News, similar: NewsMetaResult[]) {
        super(data);

        this.thumb = new ImageResult(data.thumb);
        this.background = new ImageResult(data.background);
        this.photos = data.photos.map(i => new ImageResult(i));

        this.video = data.video;

        this.heading = data.heading;
        this.body = data.body;

        this.author = new MemberResult(data.author);

        this.similar = similar
            .filter(n => n.slug !== this.slug)
            .map(n => {
                const tagScore: number = getTagScore(this.tags, n.tags);
                const dateScore: number = getDateScore(n.date);

                return {
                    slug: n.slug,
                    date: n.date,
                    score: dateScore * tagScore,
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(n => n.slug);
    }
}