import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './clubs.entity';

@Component()
export class ClubsService {

    constructor(
        @InjectRepository(Club) private readonly clubsRepository: Repository<Club>,
    ) {}

    public async find() {
        return await this.clubsRepository.find( ); // { relations: ['teams']});
    }

    public async findOne(id: number) {
        return await this.clubsRepository.findOne(id, { relations: ['teams']});
    }
}
