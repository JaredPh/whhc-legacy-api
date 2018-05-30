import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Image } from './images.entity';
import { ImagesService } from './images.service';
import { ImageRepository, mockImages } from './images.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('ImagesService', () => {
    let imageRepository: ImageRepository;
    let imagesService: ImagesService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                ImagesService,
                {
                    provide: 'ImageRepository',
                    useClass: ImageRepository,
                },
            ],
        }).compile();

        imageRepository = module.get<ImageRepository>(ImageRepository);
        imagesService = module.get<ImagesService>(ImagesService);
    });

    describe('findAll()', () => {
        let imagesRepositoryFindStub: SinonStub;
        let result: Image[];

        before(async () => {
            imagesRepositoryFindStub = sinon.stub(imageRepository, 'find').resolves(mockImages);

            result = await imagesService.findAll();
        });

        after(() => {
            imagesRepositoryFindStub.restore();
        });

        it('should return images from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockImages);
        });
    });
});
