import { PageResult, PageTree } from './pages.models';

export class PagesResponse {
    results: {
        pages: PageResult[],
        trees: PageTree[];
    };
}
