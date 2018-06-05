import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { EventsController } from './events.controller';
import { EventsService, mockEvents } from './events.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('EventsController', () => {
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
            ],
        }).compile();

        eventsService = module.get<EventsService>(EventsService);
        eventsController = module.get<EventsController>(EventsController);
    });

    describe('getAllEvents()', () => {
        let eventsServiceFindStub: SinonStub;
        let response: any;

        before(async () => {
            eventsServiceFindStub = sinon.stub(eventsService, 'find')
                .resolves(mockEvents);

            response = await eventsController.getAllEvents({});
        });

        after(() => {
            eventsServiceFindStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find method on the events service', () => {
            expect(eventsServiceFindStub).to.have.been.called;
        });

        it('should return the same number of tags as returned from the events service', () => {
            expect(response.results).to.be.an('array').of.length(mockEvents.length);
        });

        it('should return each events with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
            response.results.forEach((event) => {
                expect(event).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
            });
        });
    });

    describe('getEvent()', () => {
        let eventsServiceFindOneStub: SinonStub;
        let response: any;

        before(async () => {
            eventsServiceFindOneStub = sinon.stub(eventsService, 'findOne')
                .resolves(mockEvents[0]);

            response = await eventsController.getEvent('evnt-1');
        });

        after(() => {
            eventsServiceFindOneStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find method on the events service', () => {
            expect(eventsServiceFindOneStub).to.have.been.called;
        });

        it('should return the a single event as returned from the events service', () => {
            expect(response.results).to.be.an('array').of.length(1);
        });

        it('should return an event with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
            expect(response.results[0]).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
        });
    });
});
