import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { News } from './news.entity';
import { NewsService } from './news.service';
import { NewsRepository, mockNews } from './news.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('NewsService', () => {
    let newsRepository: NewsRepository;
    let newsService: NewsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                NewsService,
                {
                    provide: 'NewsRepository',
                    useClass: NewsRepository,
                },
            ],
        }).compile();

        newsRepository = module.get<NewsRepository>(NewsRepository);
        newsService = module.get<NewsService>(NewsService);
    });

    describe('find()', () => {
        let newsRepositoryFindStub: SinonStub;

        before(async () => {
            newsRepositoryFindStub = sinon.stub(newsRepository, 'find').resolves(mockNews);
        });

        after(() => {
            newsRepositoryFindStub.restore();
        });

        it('should return news from the repository unaltered ', async () => {
            const result: News[] = await newsService.find();
            expect(result).to.deep.equal(mockNews);
        });

        // it('should return events with exclude query from the repository unaltered ', async () => {
        //     const result: News[] = await newsService.find({ exclude: 'x' });
        //     expect(result).to.deep.equal(mockNews);
        // });
        //
        // it('should return events with past query from the repository unaltered ', async () => {
        //     const result: News[] = await newsService.find({ past: 'true' });
        //     expect(result).to.deep.equal(mockNews);
        // });
        //
        // it('should return events with future query from the repository unaltered ', async () => {
        //     const result: News[] = await newsService.find({ future: 'true' });
        //     expect(result).to.deep.equal(mockNews);
        // });
        //
        // it('should return events with bad future and past query from the repository unaltered ', async () => {
        //     const result: News[] = await newsService.find({ past: 'invalid', future: 'invalid' });
        //     expect(result).to.deep.equal(mockNews);
        // });
    });

    describe('findOne()', () => {
        let newsRepositoryFindStub: SinonStub;

        before(async () => {
            newsRepositoryFindStub = sinon.stub(newsRepository, 'findOne').resolves(mockNews[0]);
        });

        after(() => {
            newsRepositoryFindStub.restore();
        });

        it('should return news from the repository unaltered ', async () => {
            const result: News = await newsService.findOne('evnt-1');
            expect(result).to.deep.equal(mockNews[0]);
        });
    });
});
