import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { LocationsController } from './locations.controller';
import { LocationsService, mockLocations } from './locations.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('LocationsController', () => {
    let locationsService: LocationsService;
    let locationsController: LocationsController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                LocationsController,
            ],
            components: [
                {
                    provide: 'LocationsService',
                    useClass: LocationsService,
                },
            ],
        }).compile();

        locationsService = module.get<LocationsService>(LocationsService);
        locationsController = module.get<LocationsController>(LocationsController);
    });

    describe('getAllLocations()', () => {
        let locationsServiceFindAllStub: SinonStub;
        let response: any;

        before(async () => {
            locationsServiceFindAllStub = sinon.stub(locationsService, 'findAll')
                .resolves(mockLocations);

            response = await locationsController.getAllLocations();
        });

        after(() => {
            locationsServiceFindAllStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the findAll method on the images service', () => {
            expect(locationsServiceFindAllStub).to.have.been.called;
        });

        it('should return the same number of locations as returned from the images service', () => {
            expect(response.results).to.be.an('array').of.length(mockLocations.length);
        });

        it('should return each image with keys [\'id\', \'heading\', \'address\']', () => {
            response.results.forEach((location) => {
                expect(location).to.be.have.all.keys(['id', 'heading', 'address']);
            });
        });
    });
});
