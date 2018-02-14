import * as chai from 'chai';
import * as sinon from 'sinon';

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location } from './location.entity';

import { MockDataService } from '../../../test-helpers/mock-data.service';

const expect = chai.expect;

class LocationRepository extends Repository<Location> {}

describe('LocationController', () => {
    const mockData = new MockDataService();

    let locationController: LocationController;
    let locationService: LocationService;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                LocationController,
            ],
            components: [
                LocationService,
                LocationRepository,
            ],
        }).compile();

        locationService = module.get<LocationService>(LocationService);
        locationController = module.get<LocationController>(LocationController);
    });

    describe('findAll', () => {
        let data: any;
        let response: Location;

        beforeEach(async () => {
            data = mockData.getLocations();

            sinon.stub(locationService, 'findAll')
                .returns(data);

            response = await locationController.findAll();
        });

        it('should have the standard response fields', async () => {
            expect(response).to.have.keys(['messages', 'results']);
        });

        it('should return an array of clubs in results', async () => {
            expect(response.results).to.have.lengthOf(data.length);
        });

        it('should return an array of locations with fields id and name', async () => {
            response.results.map(r =>
                expect(r).to.have.keys(['id', 'name', 'address', 'town', 'postcode']),
            );
        });

        it('should return an array of clubs without the field club', async () => {
            response.results.map(r =>
                expect(r).to.not.have.key('clubs'),
            );
        });
    });

    describe('findOne', () => {

        describe('with valid id', () => {
            let response: Location;

            beforeEach(async () => {
                sinon.stub(locationService, 'findOne').returns(mockData.getLocations(1)[0]);
                response = await locationController.findOne(1);
            });

            it('should have the standard response fields', () => {
                expect(response).to.have.keys(['messages', 'results']);
            });

            it('should contain only one result ', () => {
                expect(response.results).to.have.length(1);
            });

            it('should have the fields (\'id\', \'name\', \'address\', \'town\', \'postcode\', \'clubs\') in the result', () => {
                expect(response.results[0]).to.have.keys(['id', 'name', 'address', 'town', 'postcode', 'clubs']);
            });
        });

        describe('with invalid id', () => {
            it('should return a not found exception', async () => {
                sinon.stub(locationService, 'findOne').returns(undefined);

                try {
                    await locationController.findOne(1);
                }
                catch (e) {
                    expect(e instanceof NotFoundException).to.be.true;
                }
            });
        });
    });
});