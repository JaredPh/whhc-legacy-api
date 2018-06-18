import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { PageRepository, mockPages } from './pages.test-helpers';
import { PagesService } from './pages.service';
import { Page } from './pages.entity';

chai.use(sinonChai);

const expect = chai.expect;

describe('PageService', () => {
    let pageRepository: PageRepository;
    let pagesService: PagesService;

    before(async () => {

        const module = await Test.createTestingModule({
            components: [
                PagesService,
                {
                    provide: 'PageRepository',
                    useClass: PageRepository,
                },
            ],
        }).compile();

        pageRepository = module.get<PageRepository>(PageRepository);
        pagesService = module.get<PagesService>(PagesService);
    });

    describe('findRoots()', () => {
        let pageRepositoryQBStub: SinonStub;
        let result: Page[];

        before(async () => {
            pageRepositoryQBStub = sinon.stub(pageRepository, 'createQueryBuilder').returns({
                leftJoinAndSelect: () => ({
                    leftJoinAndSelect: () => ({
                        where: () => ({
                            getMany: () => mockPages,
                        }),
                    }),
                }),
            });

            result = await pagesService.findRoots();
        });

        after(() => {
            pageRepositoryQBStub.restore();
        });

        it('should return an array of pages from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockPages);
        });
    });

    describe('findOne()', () => {
        let pageRepositoryFindStub: SinonStub;
        let result: Page;

        before(async () => {
            pageRepositoryFindStub = sinon.stub(pageRepository, 'findOne').resolves(mockPages[0]);

            result = await pagesService.findOne(1);
        });

        after(() => {
            pageRepositoryFindStub.restore();
        });

        it('should return a page from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockPages[0]);
        });
    });
});
