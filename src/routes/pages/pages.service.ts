import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Page } from './pages.entity';

@Component()
export class PagesService {

    constructor(
        @InjectRepository(Page) private readonly pageRepository: Repository<Page>,
    ) {}

    public async findAll(): Promise<Page[]> {
        return await this.pageRepository.find();
    }

    public async findOne(id: string, options?: { ancestors?: boolean; descendants?: boolean }): Promise<Page> {
        let relations = [];

        if (options.ancestors) {
            relations = [...relations, 'parent', 'parent.parent'];
        }

        if (options.descendants) {
            relations = [...relations, 'children', 'children.children'];
        }

        return await this.pageRepository.findOne(id, {
            relations,
        });
    }
}
