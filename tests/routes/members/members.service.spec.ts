import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Repository } from 'typeorm';

import { Member } from '../../../src/routes/members/members.entity';

import { mockJwtTokens, mockJwtSecret, mockSession, mockJwtIssuer } from './session.test-helpers';
import { mockMember, mockMemberTextPass } from '../../members/tests/members.test-helpers';
import { MembersService } from '../../../src/routes/members/members.service';
import { mockMembers } from './members.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

class MemberRepository extends Repository<Member> {
    find() {}
    findOne() {}
    findOneByEmail() {}
    save() {}
}

describe('MembersService', () => {
    let memberRepository: MemberRepository;
    let membersService: MembersService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                MembersService,
                {
                    provide: 'MemberRepository',
                    useClass: MemberRepository,
                },
            ],
        }).compile();

        memberRepository = module.get<MemberRepository>(MemberRepository);
        membersService = module.get<MembersService>(MembersService);
    });

    describe('findAll()', () => {
        let memberRepositoryFindStub: SinonStub;
        let result: Member[];

        before(async () => {
            memberRepositoryFindStub = sinon.stub(memberRepository, 'find').resolves(mockMembers);

            result = await membersService.findAll();
        });

        after(() => {
            memberRepositoryFindStub.restore();
        });

        it('should return members from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers);
        });
    });

    describe('findOneByUserId()', () => {
        let memberRepositoryFindOneByUserIdStub: SinonStub;
        let result: Member[];

        before(async () => {
            memberRepositoryFindOneByUserIdStub = sinon.stub(memberRepository, 'findOne')
                .resolves(mockMembers[0]);

            result = await membersService.findOneByUserId(mockMembers[0].userId);
        });

        after(() => {
            memberRepositoryFindOneByUserIdStub.restore();
        });

        it('should return a single member from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers[0]);
        });
    });

    describe('findOneByUserId()', () => {
        let memberRepositoryFindOneByEmailStub: SinonStub;
        let result: Member[];

        before(async () => {
            memberRepositoryFindOneByEmailStub = sinon.stub(memberRepository, 'findOne')
                .resolves(mockMembers[0]);

            result = await membersService.findOneByEmail(mockMembers[0].email);
        });

        after(() => {
            memberRepositoryFindOneByEmailStub.restore();
        });

        it('should return a single member from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers[0]);
        });
    });

    describe('save()', () => {
        let memberRepositorySaveStub: SinonStub;
        let result: Member[];

        before(async () => {
            memberRepositorySaveStub = sinon.stub(memberRepository, 'save')
                .resolves(mockMembers[0]);

            result = await membersService.save(mockMembers[0].email);
        });

        after(() => {
            memberRepositorySaveStub.restore();
        });

        it('should return a single member from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers[0]);
        });
    });
});
