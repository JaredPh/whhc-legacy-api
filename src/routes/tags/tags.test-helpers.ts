import { Tag } from './tags.entity';
import { Repository } from 'typeorm';

export class TagRepository extends Repository<Tag> {}

export class TagsService {
    findAll() {}
}

export const mockTags: Tag[] = [
    { id: 'tagOne' },
    { id: 'tagTwo' },
    { id: 'tagThree' },
    { id: 'tagFour' },
];