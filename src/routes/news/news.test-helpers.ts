import { News } from './news.entity';
import { Repository } from 'typeorm';

import { mockImages } from '../images/images.test-helpers';
import { mockLocations } from '../locations/locations.test-helpers';
import { mockMembers } from '../members/members.test-helpers';
import { mockTags } from '../tags/tags.test-helpers';

export class NewsRepository extends Repository<News> {}

export class NewsService {
    find() {}
    findOne() {}
    save() {}
    setSimilar() {}
}

export const expectedNewsKeys = [
    'author',
    'background',
    'body',
    'date',
    'description',
    'heading',
    'photos',
    'slug',
    'similar',
    'tags',
    'thumb',
    'video',
];

export const mockNews: News[] = [
    {
        id: 'news-1',
        heading: 'News One',
        description: 'News One Description',
        body: 'News One Body',
        video: 'abcdefg',
        date: new Date(),
        similar: [],
        thumb: mockImages[0],
        background: mockImages[1],
        photos: [],
        author: mockMembers[0],
        tags: [mockTags[0], mockTags[1]],
    },
    {
        id: 'news-2',
        heading: 'News Two',
        description: 'News Two Description',
        body: 'News Two Body',
        video: 'abcdefg',
        date: new Date(),
        similar: [],
        thumb: mockImages[0],
        background: mockImages[1],
        photos: mockImages,
        author: mockMembers[0],
        tags: [mockTags[0], mockTags[1], mockTags[2]],
    },
    {
        id: 'news-3',
        heading: 'News Three',
        description: 'News Three Description',
        body: 'News Three Body',
        video: 'abcdefg',
        date: new Date(),
        similar: [],
        thumb: mockImages[0],
        background: mockImages[1],
        photos: [],
        author: mockMembers[0],
        tags: [mockTags[2]],
    },
];
