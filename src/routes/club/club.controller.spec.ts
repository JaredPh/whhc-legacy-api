import * as chai from 'chai';
import * as sinon from 'sinon';

import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './club.entity';

const expect = chai.expect;

class ClubRepository extends Repository<Club> {}

const mockClubs = [
    {id: 1, name: 'club one'},
    {id: 2, name: 'club two'},
    {id: 3, name: 'club three'},
];

describe('ClubController', () => {
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
        it('should have the standard response fields', async () => {
            sinon.stub(clubService, 'findAll').returns(mockClubs);
            const response = await clubController.findAll();

            expect(response).to.have.keys(['messages', 'results']);
        });

        it('should return an array of clubs in results', async () => {
            sinon.stub(clubService, 'findAll').returns(mockClubs);
            const response = await clubController.findAll();

            expect(response.results).to.deep.equal(mockClubs);
        });
    });
});