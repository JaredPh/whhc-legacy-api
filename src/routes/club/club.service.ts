import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Club } from './club.entity';

@Component()
export class ClubService {

    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
    ) {}

    async findAll(): Promise<Club[]> {
        return await this.clubRepository.find();
    }

    async findOne(id: number): Promise<Club> {
        const relations = ['teams', 'locations'];
        return await this.clubRepository.findOneById(id, { relations });
    }
}