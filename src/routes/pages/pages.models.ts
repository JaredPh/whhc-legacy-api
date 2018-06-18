import { Page } from './pages.entity';
import { ImageResult } from '../images/images.models';
import { LocationResult } from '../locations/locations.models';

export class PageSummaryResult {
    id: number;
    slug: string;
    heading: string;
    banner: ImageResult;

    constructor(data: Page) {
        this.id = data.id;
        this.slug = data.slug;
        this.heading = data.heading;
        this.banner = new ImageResult(data.banner);
    }
}

export class PageResult extends PageSummaryResult{
    path: string;
    body: string;
    type: string;
    reference?: LocationResult | PageSummaryResult[];
    // weight: number;

    constructor(data: Page) {
        super(data);
        // this.banner = new ImageResult(data.banner);
        this.body = data.body;
        this.type = data.type;
        // this.heading = data.heading;
        // this.slug = data.id;
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
    id: number;
    slug: string;
    path: string;
    heading: string;
    children: PageTree[];

    constructor(data, path: string = '') {
        this.id = data.id;
        this.slug = data.slug;
        this.heading = data.heading;
        this.path = `${path}/${this.slug}`;

        if (data.children) {
            this.children = data.children
                .sort((a, b) => a.weight - b.weight)
                .map(c => new PageTree(c, this.path));
        }
    }
}
