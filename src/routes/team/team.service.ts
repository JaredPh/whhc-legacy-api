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

    async findOne(id: number, opt: any = {}): Promise<Team> {
        // let relations: string[] = ['club'];

        // if (opt.games) relations = [...relations, 'homeGames', 'awayGames'];

        const options = {
//            relations,
        };

        return await this.teamRepository.findOneById(id, options);
    }
}