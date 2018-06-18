import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { LocationsController } from './locations.controller';
import { LocationsService, mockDriving, mockLocations, mockTransit } from './locations.test-helpers';
import { LocationTransportResult } from './locations.interfaces';

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

    describe('getLocation()', () => {

        let locationServiceFindOneStub: SinonStub;
        let response: any;

        before(async () => {
            locationServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                .resolves(mockLocations[0]);

            response = await locationsController.getLocation(1);
        });

        after(() => {
            locationServiceFindOneStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find method on the news service', () => {
            expect(locationServiceFindOneStub).to.have.been.called;
        });

        it('should return the same number of tags as returned from the news service', () => {
            expect(response.results).to.be.an('array').of.length(1);
        });

        it('should return each events with keys [\'address\', \'heading\', \'home\', \'id\']', () => {
            response.results.forEach((event) => {
                expect(event).to.be.have.all.keys(['address', 'heading', 'home', 'id']);
            });
        });
    });

    describe('getTransport()', () => {
        let locationsServiceFindOneStub: SinonStub;
        let locationsServiceGetTransportStub: SinonStub;
        const mockTransportResult: LocationTransportResult = {
            driving: mockDriving,
            transit: mockTransit,
        };

        let response: any;
        before(async () => {
            locationsServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                .resolves(mockLocations[0]);

            locationsServiceGetTransportStub = sinon.stub(locationsService, 'getTransport')
                .resolves(mockTransportResult);

            response = await locationsController.getTransport(1);
        });

        after(() => {
            locationsServiceFindOneStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the findOne method on the images service', () => {
            expect(locationsServiceFindOneStub).to.have.been.called;
        });

        it('should not alter the result', () => {
            expect(response.results[0]).to.deep.equal(mockTransportResult);
        });
    });
});
