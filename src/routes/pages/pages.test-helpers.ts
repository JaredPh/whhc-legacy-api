import { Page } from './pages.entity';
import { mockImages } from '../images/images.test-helpers';
import { Repository } from 'typeorm';

export class PageRepository extends Repository<Page> {}

export class PagesService {
    findOne() {}
    findRoots() {}
}

export const expectedPageTreeKeys =  [
    'children',
    'heading',
    'id',
    'path',
    'slug',
];

export const expectedPageKeys = [
    'banner',
    'body',
    'heading',
    'description',
    'id',
    'reference',
    'slug',
    'type',
];

export const mockPages: Page[] = [
    {
        id: 1,
        slug: 'page-one',
        weight: 2,
        heading: 'Page One',
        description: 'Page One Description',
        body: '<p>Page One</p>',
        parent: null,
        children: [],
        banner: mockImages[0],
        type: 'custom',
    },
    {
        id: 2,
        slug: 'page-two',
        weight: 2,
        heading: 'Page Two',
        description: 'Page Two Description',
        body: '<p>Page Two</p>',
        parent: null,
        children: [
            {
                id: 4,
                slug: 'page-child-one',
                weight: 2,
                heading: 'Page Child One',
                description: 'Page Child One Description',
                body: '<p>Page Child One</p>',
                parent: null,
                children: [],
                banner: mockImages[0],
                type: 'custom',
            },
            {
                id: 5,
                slug: 'page-child-two',
                weight: 2,
                heading: 'Page Child One',
                description: 'Page Child One Description',
                body: '<p>Page Child One</p>',
                parent: null,
                children: [],
                banner: mockImages[0],
                type: 'custom',
            },
        ],
        banner: mockImages[0],
        type: 'landing',
    },
    {
        id: 3,
        slug: 'page-three',
        weight: 2,
        heading: 'Page Three',
        description: 'Page Three Description',
        body: '<p>Page Three</p>',
        parent: null,
        children: [],
        banner: mockImages[0],
        type: 'location',
        reference: 1,
    },
];

export const mockPageTree: Page[] = [
    {
        id: 1,
        slug: 'x100',
        weight: 100,
        type: 'landing',
        reference: null,
        heading: 'heading',
        banner: mockImages[0],
        body: '<p>body</p>',
        parent: null,
        children: [
            {
                id: 2,
                slug: 'x110',
                weight: 110,
                type: 'custom',
                reference: null,
                heading: 'heading',
                banner: mockImages[0],
                body: '<p>body</p>',
                parent: null,
                children: [
                    {
                        id: 3,
                        slug: 'x111',
                        weight: 111,
                        type: 'custom',
                        reference: null,
                        heading: 'heading',
                        banner: mockImages[0],
                        body: '<p>body</p>',
                        parent: null,
                        children: [],
                    },
                    {
                        id: 4,
                        slug: 'x112',
                        weight: 112,
                        type: 'custom',
                        reference: null,
                        heading: 'heading',
                        banner: mockImages[0],
                        body: '<p>body</p>',
                        parent: null,
                        children: [],
                    },
                ],
            },
            {
                id: 5,
                slug: 'x120',
                weight: 120,
                type: 'custom',
                reference: null,
                heading: 'heading',
                banner: mockImages[0],
                body: '<p>body</p>',
                parent: null,
                children: [],
            },
        ],
    },
    {
        id: 6,
        slug: 'x200',
        weight: 200,
        type: 'landing',
        reference: null,
        heading: 'heading',
        banner: mockImages[0],
        body: '<p>body</p>',
        parent: null,
        children: [
            {
                id: 7,
                slug: 'x210',
                weight: 210,
                type: 'custom',
                reference: null,
                heading: 'heading',
                banner: mockImages[0],
                body: '<p>body</p>',
                parent: null,
                children: [],
            },
            {
                id: 8,
                slug: 'x220',
                weight: 220,
                type: 'custom',
                reference: null,
                heading: 'heading',
                banner: mockImages[0],
                body: '<p>body</p>',
                parent: null,
                children: [],
            },
        ],
    },
];
