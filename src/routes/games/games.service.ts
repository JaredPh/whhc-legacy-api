import { Component } from '@nestjs/common';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './games.entity';
import { GamesQueryParams } from './games.interfaces';

@Component()
export class GamesService {

    constructor(
        @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    ) {}

    public async find(queryParams: GamesQueryParams): Promise<Game[]> {
        // const {
        //     count,
        //     future,
        //     past,
        // } = queryParams;
        //
        // const where: any = {};
        //
        // if (past || future) {
        //     const now = new Date().toJSON();
        //
        //     if (past === 'true' || future === 'false') {
        //         where.date = LessThan(now);
        //     } else if (past === 'false' || future === 'true') {
        //         where.date = MoreThan(now);
        //     }
        // }
        console.log('x=x=x=>', await this.gamesRepository.findOne(100));
        return await this.gamesRepository.find({
            // where,
            // take: count,
            // order: {
            //     date: (past) ? 'DESC' : 'ASC',
            //     time: (past) ? 'DESC' : 'ASC',
            // },
        });
    }

}
