import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Location } from './locations.entity';
import { LocationsService } from './locations.service';
import { LocationRepository, mockLocations } from './locations.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('LocationsService', () => {
    let locationRepository: LocationRepository;
    let locationsService: LocationsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                LocationsService,
                {
                    provide: 'LocationRepository',
                    useClass: LocationRepository,
                },
            ],
        }).compile();

        locationRepository = module.get<LocationRepository>(LocationRepository);
        locationsService = module.get<LocationsService>(LocationsService);
    });

    describe('findAll()', () => {
        let locationsRepositoryFindStub: SinonStub;
        let result: Location[];

        before(async () => {
            locationsRepositoryFindStub = sinon.stub(locationRepository, 'find').resolves(mockLocations);

            result = await locationsService.findAll();
        });

        after(() => {
            locationsRepositoryFindStub.restore();
        });

        it('should return locations from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockLocations);
        });
    });
});
