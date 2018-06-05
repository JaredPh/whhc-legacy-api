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

        it('should return events with include query from the repository unaltered ', async () => {
            const result: News[] = await newsService.find({ include: 'news-1' });
            expect(result).to.deep.equal(mockNews);
        });

        it('should return events with exclude query from the repository unaltered ', async () => {
            const result: News[] = await newsService.find({ exclude: 'news-1' });
            expect(result).to.deep.equal(mockNews);
        });
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

    describe('ave()', () => {
        let newsRepositorySaveStub: SinonStub;
        let result: News;

        before(async () => {
            newsRepositorySaveStub = sinon.stub(newsRepository, 'save').returnsArg(0);
            result = await newsService.save(mockNews[0]);
        });

        after(() => {
            newsRepositorySaveStub.restore();
        });

        it('should call the save method on the news repository', () => {
            expect(newsRepositorySaveStub).to.have.been.calledOnce;
        });

        it('should return the saved news article', () => {
            expect(result).to.deep.equal(mockNews[0]);
        });
    });

    describe('setSimilar()', () => {
        let result: News;

        before(async () => {
            result = await newsService.setSimilar({
                ...mockNews[0],
                similar: [],
            }, mockNews);
        });

        it('should return news a news item with similar set', () => {
            const expected = {
                ...mockNews[0],
                similar: [mockNews[1].id, mockNews[2].id],
            };

            expect(result).to.deep.equal(expected);
        });
    });
});
