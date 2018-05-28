import { Tag } from './tags.entity';

export class TagResult {
    name: string;

    constructor(data: Tag) {
        this.name = data.id;
    }
}