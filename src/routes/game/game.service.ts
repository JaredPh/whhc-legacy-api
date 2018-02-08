import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import * as moment from 'moment';

import { Game } from './game.entity';

const relations = [
    // 'game',
    'homeTeam',
    'homeTeam.club',
    'awayTeam',
    'awayTeam.club',
    'location',
];

@Component()
export class GameService {

    constructor(
        @Inject('GameRepositoryToken') private readonly gameRepository: Repository<Game>,
    ) {}

    async findAll(): Promise<Game[]> {
        return await this.buildGameQuery()
            .getMany();
    }

    async findAllByClub(id: number): Promise<Club[]> {
        return this.buildGameQuery()
            .where('homeClub.id=:club_id')
            .orWhere('awayClub.id=:club_id')
            .setParameter('club_id', id)
            .getMany();
    }

    async findOne(id: number): Promise<any> {
        // return await this.buildGameQuery()
        //     .where('game.id=:game_id')
        //     .setParameter('game_id', id)
        // .getOne();
        // TODO: YOU ARE HERE

        return this.gameRepository.findOneById(id, { relations });
    }

    async findRecentResults(): Promise<any> {
        const startDate = moment().day(-1).format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');

        return this.buildGameQuery()
            .where(`game.status='result'`)
            .andWhere(`game.date <= '${endDate}'`)
            .andWhere(`game.date >= '${startDate}'`)
            .orderBy('game.date')
            .addOrderBy('game.time')
            .getMany();
    }

    private buildGameQuery() {
        return this.gameRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.homeTeam', 'homeTeam')
            .leftJoinAndSelect('game.awayTeam', 'awayTeam')
            .leftJoinAndSelect('homeTeam.club', 'homeClub')
            .leftJoinAndSelect('awayTeam.club', 'awayClub')
            .leftJoinAndSelect('game.location', 'location');
    }
}
