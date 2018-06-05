import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Event } from './events.entity';
import { EventsService } from './events.service';
import { EventRepository, mockEvents } from './events.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('EventsService', () => {
    let eventRepository: EventRepository;
    let eventsService: EventsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                EventsService,
                {
                    provide: 'EventRepository',
                    useClass: EventRepository,
                },
            ],
        }).compile();

        eventRepository = module.get<EventRepository>(EventRepository);
        eventsService = module.get<EventsService>(EventsService);
    });

    describe('find()', () => {
        let eventsRepositoryFindStub: SinonStub;

        before(async () => {
            eventsRepositoryFindStub = sinon.stub(eventRepository, 'find').resolves(mockEvents);
        });

        after(() => {
            eventsRepositoryFindStub.restore();
        });

        it('should return events from the repository unaltered ', async () => {
            const result: Event[] = await eventsService.find();
            expect(result).to.deep.equal(mockEvents);
        });

        it('should return events with exclude query from the repository unaltered ', async () => {
            const result: Event[] = await eventsService.find({ exclude: 'x' });
            expect(result).to.deep.equal(mockEvents);
        });

        it('should return events with past query from the repository unaltered ', async () => {
            const result: Event[] = await eventsService.find({ past: 'true' });
            expect(result).to.deep.equal(mockEvents);
        });

        it('should return events with future query from the repository unaltered ', async () => {
            const result: Event[] = await eventsService.find({ future: 'true' });
            expect(result).to.deep.equal(mockEvents);
        });

        it('should return events with bad future and past query from the repository unaltered ', async () => {
            const result: Event[] = await eventsService.find({ past: 'invalid', future: 'invalid' });
            expect(result).to.deep.equal(mockEvents);
        });
    });

    describe('findOne()', () => {
        let eventsRepositoryFindStub: SinonStub;

        before(async () => {
            eventsRepositoryFindStub = sinon.stub(eventRepository, 'findOne').resolves(mockEvents[0]);
        });

        after(() => {
            eventsRepositoryFindStub.restore();
        });

        it('should return events from the repository unaltered ', async () => {
            const result: Event = await eventsService.findOne('evnt-1');
            expect(result).to.deep.equal(mockEvents[0]);
        });
    });
});
