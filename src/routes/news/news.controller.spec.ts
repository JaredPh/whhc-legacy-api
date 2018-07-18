import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { NewsController } from './news.controller';
import { NewsService, mockNews, expectedNewsKeys } from './news.test-helpers';
import { mockTags } from '../tags/tags.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('NewsController', () => {
    let newsService: NewsService;
    let newsController: NewsController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                NewsController,
            ],
            components: [
                {
                    provide: 'NewsService',
                    useClass: NewsService,
                },
            ],
        }).compile();

        newsService = module.get<NewsService>(NewsService);
        newsController = module.get<NewsController>(NewsController);
    });

    describe('getNewsArticles()', () => {
        describe('with no options', () => {
            let newsServiceFindStub: SinonStub;
            let response: any;

            before(async () => {
                newsServiceFindStub = sinon.stub(newsService, 'find')
                    .resolves(mockNews);

                response = await newsController.getNewsArticles({ query: {} });
            });

            after(() => {
                newsServiceFindStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find method on the news service', () => {
                expect(newsServiceFindStub).to.have.been.called;
            });

            it('should return the same number of tags as returned from the news service', () => {
                expect(response.results).to.be.an('array').of.length(mockNews.length);
            });

            it('should return each events with keys [\'author\', \'background\', \'body\', \'date\', \'heading\', \'photos\', \'slug\', \'similar\', \'tags\', \'thumb\', \'video\']', () => {
                response.results.forEach((event) => {
                    expect(event).to.be.have.all.keys(expectedNewsKeys);
                });
            });
        });

        describe('with tag in options', () => {
            let newsServiceFindStub: SinonStub;
            let response: any;

            before(async () => {
                newsServiceFindStub = sinon.stub(newsService, 'find')
                    .resolves(mockNews);

                response = await newsController.getNewsArticles({query: { tag: mockTags[0].id }});
            });

            after(() => {
                newsServiceFindStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find method on the news service', () => {
                expect(newsServiceFindStub).to.have.been.called;
            });

            it('should return the same number of tags as returned from the news service', () => {
                expect(response.results).to.be.an('array').of.length(2);
            });

            it('should return each events with expected keys', () => {
                response.results.forEach((event) => {
                    expect(event).to.be.have.all.keys(expectedNewsKeys);
                });
            });
        });

        describe('with photos in options', () => {
            let newsServiceFindStub: SinonStub;
            let response: any;

            before(async () => {
                newsServiceFindStub = sinon.stub(newsService, 'find')
                    .resolves(mockNews);

                response = await newsController.getNewsArticles({query: { photos: 'true' }});
            });

            after(() => {
                newsServiceFindStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find method on the news service', () => {
                expect(newsServiceFindStub).to.have.been.called;
            });

            it('should return the same number of tags as returned from the news service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return each events with expected keys', () => {
                response.results.forEach((event) => {
                    expect(event).to.be.have.all.keys(expectedNewsKeys);
                });
            });
        });
    });

    describe('getNewsArticle()', () => {

        let newsServiceFindOneStub: SinonStub;
        let response: any;

        before(async () => {
            newsServiceFindOneStub = sinon.stub(newsService, 'findOne')
                .resolves(mockNews[0]);

            response = await newsController.getNewsArticle('news-1');
        });

        after(() => {
            newsServiceFindOneStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find method on the news service', () => {
            expect(newsServiceFindOneStub).to.have.been.called;
        });

        it('should return the same number of tags as returned from the news service', () => {
            expect(response.results).to.be.an('array').of.length(1);
        });

        it('should return each events with expected keys', () => {
            response.results.forEach((event) => {
                expect(event).to.be.have.all.keys(expectedNewsKeys);
            });
        });
    });

    describe('setSimilarNews()', () => {

        let newsServiceFindStub: SinonStub;
        let newsServiceSaveStub: SinonStub;
        let newsServiceSetSimilarStub: SinonStub;

        let response: any;

        before(async () => {
            newsServiceFindStub = sinon.stub(newsService, 'find')
                .resolves(mockNews);

            newsServiceSaveStub = sinon.stub(newsService, 'save')
                .resolves(mockNews[0]);

            newsServiceSetSimilarStub = sinon.stub(newsService, 'setSimilar')
                .resolves(['news-1', 'news-2', 'news-3', 'news-4']);

            response = await newsController.setSimilarNews();
        });

        after(() => {
            newsServiceFindStub.restore();
            newsServiceSaveStub.restore();
            newsServiceSetSimilarStub.restore();
        });

        it('should return nothing', () => {
            expect(response).to.undefined;
        });

        it('should call the find method on the news service', () => {
            expect(newsServiceFindStub).to.have.been.calledOnce;
        });

        it('should call the setSimilar method on the news service once for each article', () => {
            expect(newsServiceSaveStub).to.have.been.calledThrice;
        });

        it('should call the save method on the news service once for each article', () => {
            expect(newsServiceSetSimilarStub).to.have.been.calledThrice;
        });
    });
});
