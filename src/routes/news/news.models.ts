import { News } from './news.entity';

import { ImageResult } from '../images/images.models';
import { MemberResult } from '../members/members.models';
import { TagResult } from '../tags/tags.models';
import * as moment from 'moment-timezone';

export class NewsResult {
    slug: string;
    date: string;
    tags: any;

    thumb: ImageResult;
    background: ImageResult;
    photos: ImageResult[];
    video: string;

    heading: string;
    body: string;

    author: MemberResult;

    similar: string[];

    constructor(data: News) {
        this.slug = data.id;

        this.date = moment(data.date).tz('europe/london').toDate().toJSON();

        this.tags = data.tags
            .map(t => new TagResult(t))
            .sort((a, b) => a.name.localeCompare(b.name));

        this.thumb = new ImageResult(data.thumb);
        this.background = new ImageResult(data.background);
        this.photos = data.photos.map(i => new ImageResult(i));

        this.video = data.video;

        this.heading = data.heading;
        this.body = data.body;

        this.author = new MemberResult(data.author);

        this.similar = data.similar;
    }
}
