import { Event } from './events.entity';

import { ImageResult } from '../images/images.models';

export class EventResult {
    end: string;
    heading: string;
    slug: string;
    start: string;
    thumb: ImageResult;

    constructor(data: Event) {
        this.slug = data.id;
        this.heading = data.heading;
        this.thumb = new ImageResult(data.thumb);

        this.start = data.start.toJSON();
        this.end = data.end.toJSON();
    }
}