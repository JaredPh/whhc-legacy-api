import { Event } from './events.entity';

import { ImageResult } from '../images/images.models';
import { LocationResult } from '../locations/locations.models';
import { MemberResult } from '../members/members.models';

export class EventResult {
    slug: string;
    thumb: ImageResult;
    background: ImageResult;

    heading: string;
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
        this.body = data.body;

        this.start = data.start.toJSON();
        this.end = data.end.toJSON();

        this.author = new MemberResult(data.author);

        this.location = new LocationResult(data.location);

        this.tags = data.tags
            .map(t => t.id)
            .sort((a, b) => a.localeCompare(b));
    }
}