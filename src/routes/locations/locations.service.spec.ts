import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Location } from './locations.entity';
import { LocationsService } from './locations.service';
import { LocationRepository, mockLocations, mockMapImage, mockDriving, mockTransit } from './locations.test-helpers';
import { LocationResult } from './locations.models';
import { GoogleMapsService } from '../../clients/google/google-maps.test-helpers';
import { GoogleMapImage } from '../../clients/google/google.interfaces';
import { LocationTransportResult } from './locations.interfaces';

chai.use(sinonChai);

const expect = chai.expect;

describe('LocationsService', () => {
    let locationRepository: LocationRepository;
    let locationsService: LocationsService;
    let googleMapsService: GoogleMapsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                LocationsService,
                GoogleMapsService,
                {
                    provide: 'LocationRepository',
                    useClass: LocationRepository,
                },
            ],
        }).compile();

        locationRepository = module.get<LocationRepository>(LocationRepository);
        locationsService = module.get<LocationsService>(LocationsService);
        googleMapsService = module.get<GoogleMapsService>(GoogleMapsService);
    });

    describe('findOne()', () => {
        let locationsRepositoryFindStub: SinonStub;
        let result: Location;

        before(async () => {
            locationsRepositoryFindStub = sinon.stub(locationRepository, 'findOne').resolves(mockLocations[0]);

            result = await locationsService.findOne(1);
        });

        after(() => {
            locationsRepositoryFindStub.restore();
        });

        it('should return a location from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockLocations[0]);
        });
    });

    describe('getMap()', () => {
        let locationsRepositoryGetMapStub: SinonStub;
        let result: GoogleMapImage;

        before(async () => {
            locationsRepositoryGetMapStub = sinon.stub(googleMapsService, 'getMap').resolves(mockMapImage);

            result = await locationsService.getMap(new LocationResult(mockLocations[0]));
        });

        after(() => {
            locationsRepositoryGetMapStub.restore();
        });

        it('should return a map image unaltered', () => {
            expect(result).to.deep.equal(mockMapImage);
        });
    });

    describe('getTransport()', () => {
        let locationsRepositoryGetDrivingTimeStub: SinonStub;
        let locationsRepositoryGetTransitTimeStub: SinonStub;
        let result: LocationTransportResult;

        before(async () => {
            locationsRepositoryGetDrivingTimeStub = sinon.stub(googleMapsService, 'getDrivingTime').resolves(mockDriving);
            locationsRepositoryGetTransitTimeStub = sinon.stub(googleMapsService, 'getTransitTime').resolves(mockTransit);

            result = await locationsService.getTransport(new LocationResult(mockLocations[0]), '');
        });

        after(() => {
            locationsRepositoryGetDrivingTimeStub.restore();
            locationsRepositoryGetTransitTimeStub.restore();
        });

        it('should return a map driving and transit times unaltered', () => {
            expect(result).to.deep.equal({
                driving: mockDriving,
                transit: mockTransit,
            });
        });
    });
});
