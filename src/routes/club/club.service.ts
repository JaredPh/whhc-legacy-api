import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Club } from './club.entity';
import { ClubResponse } from './models/ClubResponse.model';
import { GameService } from '../game/game.service';

@Component()
export class ClubService {

    constructor(
        @Inject('ClubRepositoryToken') private readonly clubRepository: Repository<Club>,
        private readonly gameService: GameService,
    ) {}

    async findAll(): Promise<Club[]> {
        return await this.clubRepository.find();
    }

    // async findOne(id: number): Promise<ClubFullResponse> {
    //     const club = await this.clubRepository.createQueryBuilder('club')
    //         .leftJoinAndSelect('club.teams', 'teams')
    //         .leftJoinAndSelect('teams.homeGames', 'homeGames')
    //         .leftJoinAndSelect('club.locations', 'locations')
    //         .leftJoinAndSelect('homeGames.homeTeam', 'homeTeam1')
    //         .leftJoinAndSelect('homeGames.awayTeam', 'awayTeam1')
    //         .leftJoinAndSelect('homeGames.location', 'awayLocation1')
    //         .leftJoinAndSelect('teams.awayGames', 'awayGames')
    //         .leftJoinAndSelect('awayGames.homeTeam', 'homeTeam2')
    //         .leftJoinAndSelect('awayGames.awayTeam', 'awayTeam2')
    //         .leftJoinAndSelect('homeTeam1.club', 'homeTeam1Club')
    //         .leftJoinAndSelect('homeTeam2.club', 'homeTeam2Club')
    //         .leftJoinAndSelect('awayTeam1.club', 'awayTeam1Club')
    //         .leftJoinAndSelect('awayTeam2.club', 'awayTeam2Club')
    //         .leftJoinAndSelect('awayGames.location', 'awayLocation2')
    //         .where('club.id=:club_id')
    //         .setParameter('club_id', id)
    //         .getOne();
    //
    //     return new ClubResponse(club);
    // }

    async findOne(id: number): Promise<ClubResponse> {
        const relations = ['teams', 'locations'];

        const club = await this.clubRepository.findOneById(id, { relations });
        club.games = await this.gameService.findAllByClub(id);

        return club;
    }
}