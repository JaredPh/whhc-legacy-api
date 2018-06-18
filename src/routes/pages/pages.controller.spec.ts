import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { PagesController } from './pages.controller';
import { mockPages, mockPageTree, PagesService } from './pages.test-helpers';
import { mockLocations, LocationsService } from '../locations/locations.test-helpers';
import { HttpException } from '@nestjs/common';

chai.use(sinonChai);

const expect = chai.expect;

describe('PagesController', () => {
    let locationsService: LocationsService;
    let pagesService: PagesService;
    let pagesController: PagesController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                PagesController,
            ],
            components: [
                {
                    provide: 'LocationsService',
                    useClass: LocationsService,
                },
                {
                    provide: 'PagesService',
                    useClass: PagesService,
                },
            ],
        }).compile();

        locationsService = module.get<LocationsService>(LocationsService);
        pagesService = module.get<PagesService>(PagesService);
        pagesController = module.get<PagesController>(PagesController);
    });

    describe('getPageTree()', () => {
        let pagesServiceServiceFindRootsStub: SinonStub;
        let response: any;

        before(async () => {
            pagesServiceServiceFindRootsStub = sinon.stub(pagesService, 'findRoots')
                .resolves(mockPageTree);

            response = await pagesController.getPageTree();
        });

        after(() => {
            pagesServiceServiceFindRootsStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the find one method on the pages service', () => {
            expect(pagesServiceServiceFindRootsStub).to.have.been.called;
        });

        it('should return the a single page as returned from the page service', () => {
            expect(response.results).to.be.an('array').of.length(2);
        });

        it('should return an pageTree with keys [\'children\', \'heading\', \'id\', \'path\', \'slug\']', () => {
            expect(response.results[0]).to.be.have.all.keys(['children', 'heading', 'id', 'path', 'slug']);
        });

        it('should return children with keys [\'children\', \'heading\', \'id\', \'path\', \'slug\']', () => {
            expect(response.results[0].children[0]).to.be.have.all.keys(['children', 'heading', 'id', 'path', 'slug']);
        });
    });

    describe('getPage()', () => {
        describe('with a page with type \'custom \'', () => {
            let pagesServiceServiceFindOneStub: SinonStub;
            let locationsServiceFindOneStub: SinonStub;
            let response: any;

            before(async () => {
                pagesServiceServiceFindOneStub = sinon.stub(pagesService, 'findOne')
                    .resolves(mockPages[1]);

                locationsServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                    .resolves(mockLocations[0]);

                response = await pagesController.getPage(1);
            });

            after(() => {
                pagesServiceServiceFindOneStub.restore();
                locationsServiceFindOneStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find one method on the pages service', () => {
                expect(pagesServiceServiceFindOneStub).to.have.been.called;
            });

            it('should not call the find one method on the locations service', () => {
                expect(locationsServiceFindOneStub).to.have.not.been.called;
            });

            it('should return the a single page as returned from the page service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return an event with keys [\'banner\', \'body\', \'heading\', \'id\', \'reference\', \'slug\', \'type\']', () => {
                expect(response.results[0]).to.be.have.all.keys(['banner', 'body', 'heading', 'id', 'reference', 'slug', 'type']);
            });
        });

        describe('with a page with type \'landing \'', () => {
            let pagesServiceServiceFindOneStub: SinonStub;
            let locationsServiceFindOneStub: SinonStub;
            let response: any;

            before(async () => {
                pagesServiceServiceFindOneStub = sinon.stub(pagesService, 'findOne')
                    .resolves(mockPages[1]);

                locationsServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                    .resolves(mockLocations[0]);

                response = await pagesController.getPage(1);
            });

            after(() => {
                pagesServiceServiceFindOneStub.restore();
                locationsServiceFindOneStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find one method on the pages service', () => {
                expect(pagesServiceServiceFindOneStub).to.have.been.called;
            });

            it('should not call the find one method on the locations service', () => {
                expect(locationsServiceFindOneStub).to.have.not.been.called;
            });

            it('should return the a single page as returned from the page service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return an event with keys [\'banner\', \'body\', \'heading\', \'id\', \'reference\', \'slug\', \'type\']', () => {
                expect(response.results[0]).to.be.have.all.keys(['banner', 'body', 'heading', 'id', 'reference', 'slug', 'type']);
            });
        });

        describe('with a page with type \'location \'', () => {
            let pagesServiceServiceFindOneStub: SinonStub;
            let locationsServiceFindOneStub: SinonStub;
            let response: any;

            before(async () => {
                pagesServiceServiceFindOneStub = sinon.stub(pagesService, 'findOne')
                    .resolves(mockPages[2]);

                locationsServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                    .resolves(mockLocations[0]);

                response = await pagesController.getPage(1);
            });

            after(() => {
                pagesServiceServiceFindOneStub.restore();
                locationsServiceFindOneStub.restore();
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should call the find one method on the pages service', () => {
                expect(pagesServiceServiceFindOneStub).to.have.been.called;
            });

            it('should call the find one method on the locations service', () => {
                expect(locationsServiceFindOneStub).to.have.been.called;
            });

            it('should return the a single page as returned from the page service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return an event with keys [\'banner\', \'body\', \'heading\', \'id\', \'reference\', \'slug\', \'type\']', () => {
                expect(response.results[0]).to.be.have.all.keys(['banner', 'body', 'heading', 'id', 'reference', 'slug', 'type']);
            });
        });

        describe('with an invalid page id', () => {
            let pagesServiceServiceFindOneStub: SinonStub;
            let locationsServiceFindOneStub: SinonStub;
            let response: any;
            let caughtError: any;

            before(async () => {
                pagesServiceServiceFindOneStub = sinon.stub(pagesService, 'findOne')
                    .resolves(null);

                locationsServiceFindOneStub = sinon.stub(locationsService, 'findOne')
                    .resolves(mockLocations[0]);

                try {
                    response = await pagesController.getPage(1);
                } catch (err) {
                    caughtError = err;
                }
            });

            after(() => {
                pagesServiceServiceFindOneStub.restore();
                locationsServiceFindOneStub.restore();
            });

            it('should throw an error', async () => {
                expect(caughtError).to.be.instanceOf(HttpException);
            });

            it('should return an error message of \'Not Found\'', () => {
                expect(caughtError.message).to.be.equal('Not Found');
            });
        });
    });
});
