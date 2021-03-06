import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { ImagesController } from './images.controller';
import { ImagesService, mockImages } from './images.test-helpers';
import { ImageResult } from './images.models';

chai.use(sinonChai);

const expect = chai.expect;

describe('ImagesController', () => {
    let imagesService: ImagesService;
    let imagesController: ImagesController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                ImagesController,
            ],
            components: [
                {
                    provide: 'ImagesService',
                    useClass: ImagesService,
                },
            ],
        }).compile();

        imagesService = module.get<ImagesService>(ImagesService);
        imagesController = module.get<ImagesController>(ImagesController);
    });

    describe('getAllImages()', () => {
        let imagesServiceFindAllStub: SinonStub;
        let response: any;

        before(async () => {
            imagesServiceFindAllStub = sinon.stub(imagesService, 'findAll')
                .resolves(mockImages);

            response = await imagesController.getAllImages();
        });

        after(() => {
            imagesServiceFindAllStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the findAll method on the images service', () => {
            expect(imagesServiceFindAllStub).to.have.been.called;
        });

        it('should return the same number of images as returned from the images service', () => {
            expect(response.results).to.be.an('array').of.length(mockImages.length);
        });

        it('should return each image with keys [\'url\', \'description\', \'width\', \'height\']', () => {
            response.results.forEach((image) => {
                expect(image).to.be.have.all.keys(['url', 'description', 'width', 'height']);
            });
        });
    });
});
