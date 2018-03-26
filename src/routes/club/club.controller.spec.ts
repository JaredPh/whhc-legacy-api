import * as chai from 'chai';
import * as sinon from 'sinon';

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './club.entity';

import { MockDataService } from '../../../test-helpers/mock-data.service';

const expect = chai.expect;

class ClubRepository extends Repository<Club> {}

describe('ClubController', () => {
    const mockData = new MockDataService();

    let clubController: ClubController;
    let clubService: ClubService;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                ClubController,
            ],
            components: [
                ClubService,
                ClubRepository,
            ],
        }).compile();

        clubService = module.get<ClubService>(ClubService);
        clubController = module.get<ClubController>(ClubController);
    });

    describe('findAll', () => {
        let data: any;
        let response: Club;

        beforeEach(async () => {
            data = mockData.getClubs();

            sinon.stub(clubService, 'findAll')
                .returns(data);

            response = await clubController.findAll();
        });

        it('should have the standard response fields', async () => {
            expect(response).to.have.keys(['messages', 'results']);
        });

        it('should return an array of clubs in results', async () => {
            expect(response.results).to.have.lengthOf(data.length);
        });

        it('should return an array of clubs with fields id and name', async () => {
            response.results.map(r =>
                expect(r).to.have.keys(['id', 'name']),
            );
        });

        it('should return an array of clubs without fields teams and locations', async () => {
            response.results.map(r =>
                expect(r).to.not.have.keys(['teams', 'locations']),
            );
        });
    });

    describe('findOne', () => {

        describe('with valid id', () => {
            let response: Club;

            beforeEach(async () => {
                sinon.stub(clubService, 'findOne').returns(mockData.getClubs(1)[0]);
                response = await clubController.findOne(1);
            });

            it('should have the standard response fields', () => {
                expect(response).to.have.keys(['messages', 'results']);
            });

            it('should contain only one result ', () => {
                expect(response.results).to.have.length(1);
            });

            it('should have the fields (\'id\', \'name\', \'locations\', \'teams\') in the result', () => {
                expect(response.results[0]).to.have.keys(['id', 'name', 'locations', 'teams']);
            });
        });

        describe('with invalid id', () => {
            it('should return a not found exception', async () => {

                sinon.stub(clubService, 'findOne').returns(null);

                try {
                    await clubController.findOne(1);
                }
                catch (e) {
                    expect(e instanceof NotFoundException).to.be.true;
                }
            });
        });
    });
});