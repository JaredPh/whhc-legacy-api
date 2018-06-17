import { Page } from './pages.entity';
import { ImageResult } from '../images/images.models';

export class PageResult {
    banner: ImageResult;
    body: string;
    heading: string;
    path: string;
    slug: string;
    type: string;
    reference: number;
    weight: number;

    constructor(data: Page) {
        this.banner = new ImageResult(data.banner);
        this.body = data.body;
        this.heading = data.heading;
        this.path = '';
        this.slug = data.id;
        this.type = data.type;
        this.weight = data.weight;

        if (data.reference) {
            this.reference = data.reference;
        }

        let x = data.parent;
        let path = '';
        while (x) {
            path = `/${x.id}${path}`;
            x = x.parent;
        }

        this.path = path;
    }
}

export class PageTree{
    slug: string;
    path: string;
    heading: string;
    children: PageTree[];

    constructor(data, path: string = '') {
        this.slug = data.id;
        this.heading = data.heading;
        this.path = `${path}/${this.slug}`;

        if (data.children) {
            this.children = data.children.map(c => new PageTree(c, this.path));
        }
    }
}
