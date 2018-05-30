import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Tag } from './tags.entity';
import { TagsService } from './tags.service';
import { TagRepository, mockTags } from './tags.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

describe('TagsService', () => {
    let tagRepository: TagRepository;
    let tagsService: TagsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                TagsService,
                {
                    provide: 'TagRepository',
                    useClass: TagRepository,
                },
            ],
        }).compile();

        tagRepository = module.get<TagRepository>(TagRepository);
        tagsService = module.get<TagsService>(TagsService);
    });

    describe('findAll()', () => {
        let tagsRepositoryFindStub: SinonStub;
        let result: Tag[];

        before(async () => {
            tagsRepositoryFindStub = sinon.stub(tagRepository, 'find').resolves(mockTags);

            result = await tagsService.findAll();
        });

        after(() => {
            tagsRepositoryFindStub.restore();
        });

        it('should return locations from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockTags);
        });
    });
});
