import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Page } from './pages.entity';

@Component()
export class PagesService {

    constructor(
        @InjectRepository(Page) private readonly pageRepository: Repository<Page>,
    ) {}

    public async findRoots(): Promise<Page[]> {
        return await this.pageRepository.createQueryBuilder('pages')
            .leftJoinAndSelect('pages.children', 'children')
            .leftJoinAndSelect('children.children', 'grandChildren')
            .where('pages.parentId IS NULL')
            .getMany();
    }

    public async findOne(id: string): Promise<Page> {
        return await this.pageRepository.findOne(id, { relations: ['children']});
    }
}
