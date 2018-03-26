import * as chai from 'chai';
import * as sinon from 'sinon';

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './team.entity';

import { MockDataService } from '../../../test-helpers/mock-data.service';

const expect = chai.expect;

class TeamRepository extends Repository<Team> {}

describe('TeamController', () => {
    const mockData = new MockDataService();

    let teamController: TeamController;
    let teamService: TeamService;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                TeamController,
            ],
            components: [
                TeamService,
                TeamRepository,
            ],
        }).compile();

        teamService = module.get<TeamService>(TeamService);
        teamController = module.get<TeamController>(TeamController);
    });

    describe('findAll', () => {
        let data: any;
        let response: Team;

        beforeEach(async () => {
            data = mockData.getTeams();

            sinon.stub(teamService, 'findAll')
                .returns(data);

            response = await teamController.findAll();
        });

        it('should have the standard response fields', async () => {
            expect(response).to.have.keys(['messages', 'results']);
        });

        it('should return an array of teams in results', async () => {
            expect(response.results).to.have.lengthOf(data.length);
        });

        it('should return an array of teams with fields id and name and club', async () => {
            response.results.map(r =>
                expect(r).to.have.keys(['id', 'name', 'club']),
            );
        });

        it('should return an array of teams without the field games', async () => {
            response.results.map(r =>
                expect(r).to.not.have.key('games'),
            );
        });
    });

    describe('findOne', () => {

        describe('with valid id', () => {
            let response: Team;

            beforeEach(async () => {
                sinon.stub(teamService, 'findOne').returns(mockData.getTeams(1)[0]);
                response = await teamController.findOne(1);
            });

            it('should have the standard response fields', () => {
                expect(response).to.have.keys(['messages', 'results']);
            });

            it('should contain only one result', () => {
                expect(response.results).to.have.length(1);
            });

            it('should have the fields (\'id\', \'name\', \'club\', \'games\') in the result', () => {
                expect(response.results[0]).to.have.keys(['id', 'name', 'club', 'games']);
            });
        });

        describe('with invalid id', () => {
            it('should return a not found exception', async () => {
                sinon.stub(teamService, 'findOne').returns(undefined);

                try {
                    await teamController.findOne(1);
                }
                catch (e) {
                    expect(e instanceof NotFoundException).to.be.true;
                }
            });
        });
    });
});
