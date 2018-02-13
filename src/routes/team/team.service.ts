import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Team } from './team.entity';

@Component()
export class TeamService {

    constructor(
        @Inject('TeamRepositoryToken') private readonly teamRepository: Repository<Team>,
    ) {}

    async findAll(): Promise<Team[]> {
        return await this.teamRepository.find({ relations: ['club'] });
    }

    async findOne(id: number): Promise<Team> {
        return await this.teamRepository.findOneById(
            id,
            {
                relations: [
                    'club',
                    'homeGames',
                    'homeGames.location',
                    'homeGames.awayTeam',
                    'awayTeam.club',
                    'awayGames',
                    'awayGames.location',
                    'awayGames.homeTeam',
                    'homeTeam.club',
                ],
            },
        );
    }
}