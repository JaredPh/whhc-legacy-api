import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Club } from './club.entity';
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

    async findOne(id: number): Promise<ClubResponse> {
        const relations = ['teams', 'locations'];

        const club = await this.clubRepository.findOneById(id, { relations });
        // club.games = await this.gameService.findAllByClub(id);

        return club;
    }
}