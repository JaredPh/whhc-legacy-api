import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { NewsController } from './news.controller';
import { NewsService, mockNews } from './news.test-helpers';

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
        let newsServiceFindStub: SinonStub;
        let response: any;

        before(async () => {
            newsServiceFindStub = sinon.stub(newsService, 'find')
                .resolves(mockNews);

            response = await newsController.getNewsArticles({ query: {}});
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

        // it('should return each events with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
        //     response.results.forEach((event) => {
        //         expect(event).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
        //     });
        // });
        //
        // it('should return events with author equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.author.fname).to.be.equal(mockNews[index].author.fname);
        //         expect(event.author.lname).to.be.equal(mockNews[index].author.lname);
        //     });
        // });
        //
        // it('should return events with background equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.background.description).to.be.equal(mockNews[index].background.description);
        //     });
        // });
        //
        // it('should return events with body equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.body).to.be.equal(mockNews[index].body);
        //     });
        // });
        //
        // it('should return events with end equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.end).to.be.equal(mockNews[index].end.toJSON());
        //     });
        // });
        //
        // it('should return events with heading equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.heading).to.be.equal(mockNews[index].heading);
        //     });
        // });
        //
        // it('should return events with location equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.location.heading).to.be.equal(mockNews[index].location.heading);
        //         expect(event.location.address).to.be.equal(mockNews[index].location.address);
        //     });
        // });
        //
        // it('should return events with slug equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.slug).to.be.equal(mockNews[index].id);
        //     });
        // });
        //
        // it('should return events with start equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.start).to.be.equal(mockNews[index].start.toJSON());
        //     });
        // });
        //
        // it('should return events with tags equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.tags.length).to.be.equal(mockNews[index].tags.length);
        //     });
        // });
        //
        // it('should return events with thumb equal to the value returned from the events service', () => {
        //     response.results.forEach((event, index) => {
        //         expect(event.thumb.description).to.be.equal(mockNews[index].thumb.description);
        //     });
        // });
    });

    // describe('getNewsArticle()', () => {
    //     let eventsServiceFindOneStub: SinonStub;
    //     let response: any;
    //
    //     before(async () => {
    //         eventsServiceFindOneStub = sinon.stub(newsService, 'findOne')
    //             .resolves(mockNews[0]);
    //
    //         response = await newsController.getNewsArticle('evnt-1');
    //     });
    //
    //     after(() => {
    //         eventsServiceFindOneStub.restore();
    //     });
    //
    //     it('should return an object with key [\'results\']', () => {
    //         expect(response).to.have.all.keys(['results']);
    //     });
    //
    //     it('should call the find method on the events service', () => {
    //         expect(eventsServiceFindOneStub).to.have.been.called;
    //     });
    //
    //     it('should return the a single event as returned from the events service', () => {
    //         expect(response.results).to.be.an('array').of.length(1);
    //     });

        // it('should return an event with keys [\'author\', \'background\', \'body\', \'end\', \'heading\', \'location\', \'slug\', \'start\', \'tags\', \'thumb\']', () => {
        //     expect(response.results[0]).to.be.have.all.keys(['author', 'background', 'body', 'end', 'heading', 'location', 'slug', 'start', 'tags', 'thumb']);
        // });
        //
        // it('should return an event with author equal to the value returned from the events service', () => {
        //     expect(response.results[0].author.fname).to.be.equal(mockNews[0].author.fname);
        //     expect(response.results[0].author.lname).to.be.equal(mockNews[0].author.lname);
        // });
        //
        // it('should return an event with background equal to the value returned from the events service', () => {
        //     expect(response.results[0].background.description).to.be.equal(mockNews[0].background.description);
        // });
        //
        // it('should return an event with body equal to the value returned from the events service', () => {
        //     expect(response.results[0].body).to.be.equal(mockNews[0].body);
        // });
        //
        // it('should return an event with end equal to the value returned from the events service', () => {
        //     expect(response.results[0].end).to.be.equal(mockNews[0].end.toJSON());
        // });
        //
        // it('should return an event with heading equal to the value returned from the events service', () => {
        //     expect(response.results[0].heading).to.be.equal(mockNews[0].heading);
        // });
        //
        // it('should return an event with location equal to the value returned from the events service', () => {
        //     expect(response.results[0].location.heading).to.be.equal(mockNews[0].location.heading);
        //     expect(response.results[0].location.address).to.be.equal(mockNews[0].location.address);
        // });
        //
        // it('should return an event with slug equal to the value returned from the events service', () => {
        //     expect(response.results[0].slug).to.be.equal(mockNews[0].id);
        // });
        //
        // it('should return an event with start equal to the value returned from the events service', () => {
        //     expect(response.results[0].start).to.be.equal(mockNews[0].start.toJSON());
        // });
        //
        // it('should return an event with tags equal to the value returned from the events service', () => {
        //     expect(response.results[0].tags.length).to.be.equal(mockNews[0].tags.length);
        // });
        //
        // it('should return an event with thumb equal to the value returned from the events service', () => {
        //     expect(response.results[0].thumb.description).to.be.equal(mockNews[0].thumb.description);
        // });
    // });
});
