import { Event } from './events.entity';

import { TagResult } from '../tags/tags.models';
import { ImageResult } from '../images/images.models';
import { LocationResult } from '../locations/locations.models';

export class EventResult {
    end: string;
    heading: string;
    slug: string;
    start: string;
    thumb: ImageResult;
    location: LocationResult;
    tags: any;

    constructor(data: Event) {
        this.slug = data.id;
        this.heading = data.heading;

        this.start = data.start.toJSON();
        this.end = data.end.toJSON();

        this.thumb = new ImageResult(data.thumb);
        this.location = new LocationResult(data.location);

        this.tags = data.tags
            .map(t => new TagResult(t))
            .map(t => t.name)
            .sort((a, b) => a.localeCompare(b));
    }
}