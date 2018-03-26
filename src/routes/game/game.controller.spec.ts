import * as chai from 'chai';
import * as sinon from 'sinon';

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from './game.entity';

import { MockDataService } from '../../../test-helpers/mock-data.service';

const expect = chai.expect;

class GameRepository extends Repository<Game> {}

describe('GameController', () => {
    const mockData = new MockDataService();

    let gameController: GameController;
    let gameService: GameService;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                GameController,
            ],
            components: [
                GameService,
                GameRepository,
            ],
        }).compile();

        gameService = module.get<GameService>(GameService);
        gameController = module.get<GameController>(GameController);
    });

    describe('findAll', () => {
        let data: any;
        let response: Game;

        beforeEach(async () => {
            data = mockData.getGames();

            sinon.stub(gameService, 'findAll')
                .returns(data);

            response = await gameController.findAll();
        });

        it('should have the standard response fields', async () => {
            expect(response).to.have.keys(['messages', 'results']);
        });

        it('should return an array of games in results', async () => {
            expect(response.results).to.have.lengthOf(data.length);
        });

        it('should return an array of games with fields \'id\', \'date\', \'time\', \'format\', \'status\', \'homeTeam\', \'awayTeam\'', async () => {
            response.results.map(r =>
                expect(r).to.contain.keys(['id', 'date', 'time', 'format', 'status', 'homeTeam', 'awayTeam']),
            );
        });

        it('should have field \'score\' when status is \'result\'', async () => {
            response.results.map(r => {
                if (r.status === 'result') {
                    expect(r).to.contain.key('score');
                }
            });
        });

        it('should not have field \'score\' when status is not \'result\'', async () => {
            response.results.map(r => {
                if (r.status !!= 'result') {
                    expect(r).not.to.contain.key('score');
                }
            });
        });
    });

    describe('findOne', () => {

        describe('with valid id', () => {
            let response: Game;

            beforeEach(async () => {
                sinon.stub(gameService, 'findOne').returns(mockData.getGames(1)[0]);
                response = await gameController.findOne(1);
            });

            it('should have the standard response fields', () => {
                expect(response).to.have.keys(['messages', 'results']);
            });

            it('should contain only one result', () => {
                expect(response.results).to.have.length(1);
            });

            it('should have fields \'id\', \'date\', \'time\', \'format\', \'status\', \'homeTeam\', \'awayTeam\'', async () => {
                expect(response.results[0]).to.contain.keys(['id', 'date', 'time', 'format', 'status', 'homeTeam', 'awayTeam']);
            });
        });

        describe('with invalid id', () => {
            it('should return a not found exception', async () => {
                sinon.stub(gameService, 'findOne').returns(undefined);

                try {
                    await gameController.findOne(1);
                }
                catch (e) {
                    expect(e instanceof NotFoundException).to.be.true;
                }
            });
        });
    });
});
