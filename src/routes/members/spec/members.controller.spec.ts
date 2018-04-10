import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { MembersController } from '../members.controller';
import { mockMembers } from './members.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

class MembersService {
    findAll() {}
}

describe('MemberController', () => {
    let membersService: MemberService;
    let membersController: MembersController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                MembersController,
            ],
            components: [
                {
                    provide: 'MembersService',
                    useClass: MembersService,
                },
            ],
        }).compile();

        membersService = module.get<MembersService>(MembersService);
        membersController = module.get<MembersController>(MembersController);
    });

    describe('getAllMembers()', () => {
        let memberServiceFindAllStub: SinonStub;
        let result: any;

        before(async () => {
            memberServiceFindAllStub = sinon.stub(membersService, 'findAll')
                .resolves(mockMembers);

            result = await membersController.getAllMembers();
        });

        after(() => {
            memberServiceFindAllStub.restore();
        });

        it('should return an object with key [\'members\']', () => {
            expect(result).to.have.all.keys(['members']);
        });

        it('should call the findAll method on the members service', () => {
            expect(memberServiceFindAllStub).to.have.been.called;
        });

        it('should return the same number of members as returned from the members service', () => {
            expect(result.members).to.be.an('array').of.length(3);
        });

        it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'roles\']', () => {
            result.members.forEach((member) => {
                expect(member).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'roles']);
            });
        });

        it('should return members with id equal to the value returned from the members service', () => {
            result.members.forEach((member, index) => {
                expect(member.id).to.be.equal(mockMembers[index].id);
            });
        });

        it('should return members with email equal to the value returned from the members service', () => {
            result.members.forEach((member, index) => {
                expect(member.email).to.be.equal(mockMembers[index].email);
            });
        });

        it('should return members with fname equal to the value returned from the members service', () => {
            result.members.forEach((member, index) => {
                expect(member.fname).to.be.equal(mockMembers[index].fname);
            });
        });

        it('should return members with lname equal to the value returned from the members service', () => {
            result.members.forEach((member, index) => {
                expect(member.lname).to.be.equal(mockMembers[index].lname);
            });
        });

        it('should return members with roles as an array of strings', () => {
            result.members.forEach((member) => {
                expect(member.roles).to.be.an('array');
                member.roles.forEach(role => expect(role).to.be.a('string'));
            });
        });
    });

    describe('getCurrentMember()', () => {
        let result: any;
        const currentUser = mockMembers[0];

        before(async () => {
            result = await membersController.getCurrentMember(currentUser);
        });

        it('should return an object with key [\'member\']', () => {
            expect(result).to.have.all.keys(['member']);
        });

        it('should return member with keys [\'id\', \'email\', \'fname\', \'lname\', \'roles\']', () => {
            expect(result.member).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'roles']);
        });

        it('should return id equal to the current user id', () => {
            expect(result.member.id).to.be.equal(currentUser.id);
        });

        it('should return members with email equal to the value returned from the members service', () => {
            expect(result.member.email).to.be.equal(currentUser.email);
        });

        it('should return members with fname equal to the value returned from the members service', () => {
            expect(result.member.fname).to.be.equal(currentUser.fname);
        });

        it('should return members with lname equal to the value returned from the members service', () => {
            expect(result.member.lname).to.be.equal(currentUser.lname);
        });

        it('should return members with roles as an array of strings', () => {
            expect(result.member.roles).to.be.an('array');
            result.member.roles.forEach(role => expect(role).to.be.a('string'));
        });
    });
});
