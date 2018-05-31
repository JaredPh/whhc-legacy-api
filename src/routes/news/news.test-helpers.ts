import { News } from './news.entity';
import { Repository } from 'typeorm';

// import { mockImages } from '../images/images.test-helpers';
// import { mockLocations } from '../locations/locations.test-helpers';
// import { mockMembers } from '../members/members.test-helpers';
// import { mockTags } from '../tags/tags.test-helpers';

export class NewsRepository extends Repository<News> {}

export class NewsService {
    find() {}
    findOne() {}
}

export const mockNews: News[] = [
];