import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { MembersController } from '../../../src/routes/members/members.controller';
import { mockMembers } from './members.test-helpers';
import { MemberPostRegistrationRequest } from '../../../src/routes/members/members.models';
import { async } from 'rxjs/scheduler/async';
import { BadRequestException } from '@nestjs/common';

chai.use(sinonChai);

const expect = chai.expect;

class MembersService {
    findAll() {}
    findOneByEmail() {}
    save() {}
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

        it('should return an object with key [\'members\']', () => {
            expect(result).to.have.all.keys(['members']);
        });

        it('should return the same number of members as returned from the members service', () => {
            expect(result.members).to.be.an('array').of.length(1);
        });

        it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'roles\']', () => {
            expect(result.members[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'roles']);
        });

        it('should return members with id equal to the value returned from the members service', () => {
            expect(result.members[0].id).to.be.equal(mockMembers[0].id);
        });

        it('should return members with email equal to the value returned from the members service', () => {
            expect(result.members[0].email).to.be.equal(mockMembers[0].email);
        });

        it('should return members with fname equal to the value returned from the members service', () => {
            expect(result.members[0].fname).to.be.equal(mockMembers[0].fname);
        });

        it('should return members with lname equal to the value returned from the members service', () => {
            expect(result.members[0].lname).to.be.equal(mockMembers[0].lname);
        });

        it('should return members with roles as an array of strings', () => {
            expect(result.members[0].roles).to.be.an('array');
            result.members[0].roles.forEach(role => expect(role).to.be.a('string'));
        });
    });

    describe('createMemberPostCognitoRegistration()', () => {
        let memberServiceFindOneByEmailStub: SinonStub;
        let memberServiceSaveStub: SinonStub;


        beforeEach(() => {
            memberServiceSaveStub = sinon.stub(membersService, 'save');
            memberServiceFindOneByEmailStub = sinon.stub(membersService, 'findOneByEmail');
        });

        afterEach(() => {
            memberServiceFindOneByEmailStub.restore();
            memberServiceSaveStub.restore();
        });

        it('should throw an error a userId already exists against an id', async () => {
            let caughtError;
            const { userId, fname, lname, email } = mockMembers[0];

            memberServiceFindOneByEmailStub.resolves({ userId, fname, lname, email });

            try {
                await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                });
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError instanceof BadRequestException).to.be.true;
        });

        describe('adding a user to an existing member', () => {
            let result: any;

            beforeEach(async () => {
                const {userId, fname, lname, email} = mockMembers[0];

                memberServiceFindOneByEmailStub.resolves({fname, lname, email});
                memberServiceSaveStub.resolves(mockMembers[0]);

                result = await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                });
            });

            it('should return an object with key [\'members\']', () => {
                expect(result).to.have.all.keys(['members']);
            });

            it('should return the same number of members as returned from the members service', () => {
                expect(result.members).to.be.an('array').of.length(1);
            });

            it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'roles\']', () => {
                expect(result.members[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'roles']);
            });

            it('should return members with id equal to the value returned from the members service', () => {
                expect(result.members[0].id).to.be.equal(mockMembers[0].id);
            });

            it('should return members with email equal to the value returned from the members service', () => {
                expect(result.members[0].email).to.be.equal(mockMembers[0].email);
            });

            it('should return members with fname equal to the value returned from the members service', () => {
                expect(result.members[0].fname).to.be.equal(mockMembers[0].fname);
            });

            it('should return members with lname equal to the value returned from the members service', () => {
                expect(result.members[0].lname).to.be.equal(mockMembers[0].lname);
            });

            it('should return members with roles as an array of strings', () => {
                expect(result.members[0].roles).to.be.an('array');
                result.members[0].roles.forEach(role => expect(role).to.be.a('string'));
            });
        });

        describe('adding a user to a new member', () => {
            let result: any;

            beforeEach(async () => {
                const {userId, fname, lname, email} = mockMembers[0];

                memberServiceFindOneByEmailStub.resolves(null);
                memberServiceSaveStub.resolves(mockMembers[0]);

                result = await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                });
            });

            it('should return an object with key [\'members\']', () => {
                expect(result).to.have.all.keys(['members']);
            });

            it('should return the same number of members as returned from the members service', () => {
                expect(result.members).to.be.an('array').of.length(1);
            });

            it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'roles\']', () => {
                expect(result.members[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'roles']);
            });

            it('should return members with id equal to the value returned from the members service', () => {
                expect(result.members[0].id).to.be.equal(mockMembers[0].id);
            });

            it('should return members with email equal to the value returned from the members service', () => {
                expect(result.members[0].email).to.be.equal(mockMembers[0].email);
            });

            it('should return members with fname equal to the value returned from the members service', () => {
                expect(result.members[0].fname).to.be.equal(mockMembers[0].fname);
            });

            it('should return members with lname equal to the value returned from the members service', () => {
                expect(result.members[0].lname).to.be.equal(mockMembers[0].lname);
            });

            it('should return members with roles as an array of strings', () => {
                expect(result.members[0].roles).to.be.an('array');
                result.members[0].roles.forEach(role => expect(role).to.be.a('string'));
            });
        });
    });
});
