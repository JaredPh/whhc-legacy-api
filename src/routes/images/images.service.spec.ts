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
    let memberRepository: ImageRepository;
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

        memberRepository = module.get<ImageRepository>(ImageRepository);
        imagesService = module.get<ImagesService>(ImagesService);
    });

    describe('findAll()', () => {
        let imagesRepositoryFindStub: SinonStub;
        let result: Image[];

        before(async () => {
            imagesRepositoryFindStub = sinon.stub(memberRepository, 'find').resolves(mockImages);

            result = await imagesService.findAll();
        });

        after(() => {
            imagesRepositoryFindStub.restore();
        });

        it('should return members from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockImages);
        });
    });
});
