import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Game } from './game.entity';

const relations = [
    'homeTeam',
    'homeTeam.club',
    'awayTeam',
    'awayTeam.club',
    'location',
];

@Component()
export class GameService {

    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) {}

    async findAll(): Promise<Game[]> {
        return await this.gameRepository.find({ relations });
    }

    async findOne(id: number): Promise<Game> {
        return await this.gameRepository.findOneById(id, { relations });
    }
}