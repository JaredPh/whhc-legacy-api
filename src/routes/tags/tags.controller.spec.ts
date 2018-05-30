import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { TagsController } from './tags.controller';
import { TagsService, mockTags } from './tags.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('LocationsController', () => {
    let locationsService: TagsService;
    let locationsController: TagsController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                TagsController,
            ],
            components: [
                {
                    provide: 'TagsService',
                    useClass: TagsService,
                },
            ],
        }).compile();

        locationsService = module.get<TagsService>(TagsService);
        locationsController = module.get<TagsController>(TagsController);
    });

    describe('getAllLocations()', () => {
        let tagsServiceFindAllStub: SinonStub;
        let response: any;

        before(async () => {
            tagsServiceFindAllStub = sinon.stub(locationsService, 'findAll')
                .resolves(mockTags);

            response = await locationsController.getAllTags();
        });

        after(() => {
            tagsServiceFindAllStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the findAll method on the images service', () => {
            expect(tagsServiceFindAllStub).to.have.been.called;
        });

        it('should return the same number of tags as returned from the images service', () => {
            expect(response.results).to.be.an('array').of.length(mockTags.length);
        });

        it('should return each image with keys [\'name\'', () => {
            response.results.forEach((tag) => {
                expect(tag).to.be.have.all.keys(['name']);
            });
        });

        it('should return tags with id equal to the value returned from the images service', () => {
            response.results.forEach((tag, index) => {
                expect(tag.name).to.be.equal(mockTags[index].id);
            });
        });
    });
});
