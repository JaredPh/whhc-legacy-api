import { Event } from './events.entity';

import { ImageResult } from '../images/images.models';
import { LocationResult } from '../locations/locations.models';
import { MemberResult } from '../members/members.models';
import { TagResult } from '../tags/tags.models';
import * as moment from 'moment-timezone';

export class EventResult {
    slug: string;
    thumb: ImageResult;
    background: ImageResult;

    heading: string;
    description: string;
    body: string;

    start: string;
    end: string;

    author: MemberResult;

    location: LocationResult;
    tags: any;

    constructor(data: Event) {
        this.slug = data.id;
        this.thumb = new ImageResult(data.thumb);
        this.background = new ImageResult(data.background);

        this.heading = data.heading;
        this.description = data.description;
        this.body = data.body;

        this.start = moment(data.start).tz('europe/london').toDate().toJSON();

        this.end = moment(data.end).tz('europe/london').toDate().toJSON();

        this.author = new MemberResult(data.author);

        this.location = new LocationResult(data.location);

        this.tags = data.tags
            .map(t => new TagResult(t))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
}
