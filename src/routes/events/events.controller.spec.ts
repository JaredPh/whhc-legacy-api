import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { EventsController } from './events.controller';
import { EventsService, mockEvents } from './events.test-helpers';
import { LocationsService, mockMapImage } from '../locations/locations.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('EventsController', () => {
    let locationsService: LocationsService;
    let eventsService: EventsService;
    let eventsController: EventsController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                EventsController,
            ],
            components: [
                {
                    provide: 'EventsService',
                    useClass: EventsService,
                },
                {
                    provide: 'LocationsService',
                    useClass: LocationsService,
                },
            ],
        }).compile();

        locationsService = module.get<LocationsService>(LocationsService);
        eventsService = module.get<EventsService>(EventsService);
        eventsController = module.get<EventsController>(EventsController);
    });

    describe('getAllEvents()', () => {
        describe('with no tag filter', () => {
            let eventsServiceFindStub: SinonStub;
            let locationsServiceGetMapStub: SinonStub;

            let response: any;

            before(async () => {
                locationsServiceGetMapStub = sinon.stub(locationsService, 'getMap')
                    .returns(mockMapImage);

                eventsServiceFindStub = sinon.stub(eventsService, 'find')
                    .resolves(mockEvents);

                response = await eventsController.getAllEvents({});
            });

            after(() => {
                locationsServiceGetMapStub.restore();
                eventsServiceFindStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find method on the events service', () => {
                expect(eventsServiceFindStub).to.have.been.called;
            });

            it('should call the get map method on the locations service', () => {
                expect(locationsServiceGetMapStub).to.have.been.called;
            });

            it('should return the same number of tags as returned from the events service', () => {
                expect(response.results).to.be.an('array').of.length(mockEvents.length);
            });

            it('should return each events with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
                response.results.forEach((event) => {
                    expect(event).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
                });
            });

            it('should return each location with keys [\'id\', \'home\', \'heading\', \'address\', \'map\']', () => {
                response.results.forEach((event) => {
                    expect(event.location).to.be.have.all.keys(['id', 'home', 'heading', 'address', 'map']);
                });
            });
        });

        describe('with tag filter', () => {
            let eventsServiceFindStub: SinonStub;
            let locationsServiceGetMapStub: SinonStub;

            let response: any;

            before(async () => {
                locationsServiceGetMapStub = sinon.stub(locationsService, 'getMap')
                    .returns(mockMapImage);

                eventsServiceFindStub = sinon.stub(eventsService, 'find')
                    .resolves(mockEvents);

                response = await eventsController.getAllEvents({ query: { tag: 'tagTwo' }});
            });

            after(() => {
                locationsServiceGetMapStub.restore();
                eventsServiceFindStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find method on the events service', () => {
                expect(eventsServiceFindStub).to.have.been.called;
            });

            it('should call the get map method on the locations service', () => {
                expect(locationsServiceGetMapStub).to.have.been.called;
            });

            it('should return the same number of tags as returned from the events service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return each events with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
                response.results.forEach((event) => {
                    expect(event).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
                });
            });

            it('should return each location with keys [\'id\', \'home\', \'heading\', \'address\', \'map\']', () => {
                response.results.forEach((event) => {
                    expect(event.location).to.be.have.all.keys(['id', 'home', 'heading', 'address', 'map']);
                });
            });
        });
    });

    describe('getEvent()', () => {
        let locationsServiceGetMapStub: SinonStub;
        let eventsServiceFindOneStub: SinonStub;
        let response: any;

        before(async () => {
            locationsServiceGetMapStub = sinon.stub(locationsService, 'getMap')
                .returns(mockMapImage);

            eventsServiceFindOneStub = sinon.stub(eventsService, 'findOne')
                .resolves(mockEvents[0]);

            response = await eventsController.getEvent('evnt-1');
        });

        after(() => {
            locationsServiceGetMapStub.restore();
            eventsServiceFindOneStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find method on the events service', () => {
            expect(eventsServiceFindOneStub).to.have.been.called;
        });

        it('should call the get map method on the locations service', () => {
            expect(locationsServiceGetMapStub).to.have.been.called;
        });

        it('should return the a single event as returned from the events service', () => {
            expect(response.results).to.be.an('array').of.length(1);
        });

        it('should return an event with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
            expect(response.results[0]).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
        });

        it('should return location with keys [\'id\', \'home\', \'heading\', \'address\', \'map\']', () => {
            expect(response.results[0].location).to.be.have.all.keys(['id', 'home', 'heading', 'address', 'map']);
        });
    });
});
