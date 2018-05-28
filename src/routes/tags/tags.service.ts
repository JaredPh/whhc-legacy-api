import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from './tags.entity';
import { TagResult } from './tags.models';

@Component()
export class TagsService {

    constructor(
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    ) {}

    public async findAll(): Promise<TagResult[]> {
        return (await this.tagRepository.find())
            .map(i => new TagResult(i));
    }
}
