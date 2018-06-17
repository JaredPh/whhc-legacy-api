import { Page } from './pages.entity';
import { ImageResult } from '../images/images.models';
import { LocationResult } from '../locations/locations.models';

export class PageSummaryResult {
    banner: ImageResult;
    heading: string;
    slug: string;

    constructor(data: Page) {
        this.banner = new ImageResult(data.banner);
        this.heading = data.heading;
        this.slug = data.id;
    }
}

export class PageResult extends PageSummaryResult{
    // banner: ImageResult;
    body: string;
    // heading: string;
    path: string;
    // slug: string;
    type: string;
    reference?: LocationResult | PageSummaryResult[];
    // weight: number;

    constructor(data: Page) {
        super(data);
        // this.banner = new ImageResult(data.banner);
        this.body = data.body;
        // this.heading = data.heading;
        this.path = '';
        // this.slug = data.id;
        this.type = data.type;
        // this.weight = data.weight;

        let x = data.parent;
        let path = '';
        while (x) {
            path = `/${x.id}${path}`;
            x = x.parent;
        }

        this.path = path;
    }

    setReference(reference: LocationResult | PageSummaryResult[]) {
        this.reference = reference;
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
            this.children = data.children
                .sort((a, b) => a.weight - b.weight)
                .map(c => new PageTree(c, this.path));
        }
    }
}
