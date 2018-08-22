import { Component } from '@nestjs/common';
import { Brackets, In, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './games.entity';
import { GamesQueryParams } from './games.interfaces';
import { GameResult } from './games.model';

@Component()
export class GamesService {

    constructor(
        @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    ) {}

    public async find(queryParams: GamesQueryParams): Promise<Game[]> {

        const {
            count,
            future,
            past,
        } = queryParams;

        const where: any = {};

        if (past || future) {
            const now = new Date().toJSON();

            if (past === 'true' || future === 'false') {
                where.date = LessThan(now);
            } else if (past === 'false' || future === 'true') {
                where.date = MoreThan(now);
            }
        }

        return await this.gamesRepository.find({
            where,
            take: count,
            order: {
                date: (past) ? 'DESC' : 'ASC',
                time: (past) ? 'DESC' : 'ASC',
            },
        });
    }

    public async findOne(id: number): Promise<Game> {
        return await this.gamesRepository.findOne(id);
    }

    public async findSimilar(game: GameResult): Promise<Game[]> {
        return await this.gamesRepository.find({
            where: {
                homeTeam: In([game.homeTeam.id, game.awayTeam.id]),
                awayTeam: In([game.homeTeam.id, game.awayTeam.id]),
                id: Not(game.id),
            },
        });
    }
}
