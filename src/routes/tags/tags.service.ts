import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from './tags.entity';

@Component()
export class TagsService {

    constructor(
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    ) {}

    public async findAll(): Promise<Tag[]> {
        return await this.tagRepository.find();
    }
}
