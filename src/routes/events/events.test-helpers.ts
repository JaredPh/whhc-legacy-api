import { Event } from './events.entity';
import { Repository } from 'typeorm';

import { mockImages } from '../images/images.test-helpers';
import { mockLocations } from '../locations/locations.test-helpers';
import { mockMembers } from '../members/members.test-helpers';
import { mockTags } from '../tags/tags.test-helpers';

export class EventRepository extends Repository<Event> {}

export class EventsService {
    find() {}
    findOne() {}
    getMap() {}
}

export const expectedEventKeys = [
    'author',
    'background',
    'body',
    'description',
    'end',
    'heading',
    'location',
    'slug',
    'start',
    'tags',
    'thumb',
];

export const expectedEventLocationKeys = [
    'id',
    'home',
    'heading',
    'address',
    'map',
];

export const mockEvents: Event[] = [
    {
        id: 'evnt-1',
        heading: 'event one',
        description: 'event one description',
        body: '<p>bodu</p>',
        start: new Date(),
        end: new Date(),
        thumb: mockImages[0],
        background: mockImages[1],
        location: mockLocations[0],
        author: mockMembers[0],
        tags: mockTags,
    },
    {
        id: 'evnt-2',
        heading: 'event two',
        description: 'event two description',
        body: '<p>body</p>',
        start: new Date(),
        end: new Date(),
        thumb: mockImages[1],
        background: mockImages[2],
        location: mockLocations[1],
        author: mockMembers[1],
        tags: [ mockTags[0] ],
    },
];
