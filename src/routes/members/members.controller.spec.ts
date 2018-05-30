import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { MembersController } from './members.controller';
import { mockMembers } from './members.test-helpers';
import { BadRequestException } from '@nestjs/common';

chai.use(sinonChai);

const expect = chai.expect;

class MembersService {
    findAll() {}
    findOneByEmail() {}
    save() {}
}

describe('MemberController', () => {
    let membersService: MembersService;
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
        let response: any;

        before(async () => {
            memberServiceFindAllStub = sinon.stub(membersService, 'findAll')
                .resolves(mockMembers);

            response = await membersController.getAllMembers();
        });

        after(() => {
            memberServiceFindAllStub.restore();
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should call the findAll method on the members service', () => {
            expect(memberServiceFindAllStub).to.have.been.called;
        });

        it('should return the same number of members as returned from the members service', () => {
            expect(response.results).to.be.an('array').of.length(3);
        });

        it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'avatar\']', () => {
            response.results.forEach((member) => {
                expect(member).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'avatar']);
            });
        });

        it('should return members with id equal to the value returned from the members service', () => {
            response.results.forEach((member, index) => {
                expect(member.id).to.be.equal(mockMembers[index].id);
            });
        });

        it('should return members with email equal to the value returned from the members service', () => {
            response.results.forEach((member, index) => {
                expect(member.email).to.be.equal(mockMembers[index].email);
            });
        });

        it('should return members with fname equal to the value returned from the members service', () => {
            response.results.forEach((member, index) => {
                expect(member.fname).to.be.equal(mockMembers[index].fname);
            });
        });

        it('should return members with lname equal to the value returned from the members service', () => {
            response.results.forEach((member, index) => {
                expect(member.lname).to.be.equal(mockMembers[index].lname);
            });
        });
    });

    describe('getCurrentMember()', () => {
        let response: any;
        const currentUser = mockMembers[0];

        before(async () => {
            response = await membersController.getCurrentMember(currentUser);
        });

        it('should return an object with key [\'results\']', () => {
            expect(response).to.have.all.keys(['results']);
        });

        it('should return the same number of members as returned from the members service', () => {
            expect(response.results).to.be.an('array').of.length(1);
        });

        it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'avatar\', \'roles\']', () => {
            expect(response.results[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'avatar', 'roles']);
        });

        it('should return members with id equal to the value returned from the members service', () => {
            expect(response.results[0].id).to.be.equal(mockMembers[0].id);
        });

        it('should return members with email equal to the value returned from the members service', () => {
            expect(response.results[0].email).to.be.equal(mockMembers[0].email);
        });

        it('should return members with fname equal to the value returned from the members service', () => {
            expect(response.results[0].fname).to.be.equal(mockMembers[0].fname);
        });

        it('should return members with lname equal to the value returned from the members service', () => {
            expect(response.results[0].lname).to.be.equal(mockMembers[0].lname);
        });

        it('should return members with roles as an array of strings', () => {
            expect(response.results[0].roles).to.be.an('array');
            response.results[0].roles.forEach(role => expect(role).to.be.a('string'));
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
            const { userId, fname, lname, email, gender } = mockMembers[0];
            memberServiceFindOneByEmailStub.resolves({ userId, fname, lname, email, gender });

            try {
                await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                    gender,
                });
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError instanceof BadRequestException).to.be.true;
        });

        describe('adding a user to an existing member', () => {
            let response: any;

            beforeEach(async () => {
                const {userId, fname, lname, email, gender } = mockMembers[2];

                memberServiceFindOneByEmailStub.resolves({ fname, lname, email, gender });
                memberServiceSaveStub.resolves(mockMembers[0]);

                response = await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                    gender,
                });
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should return the same number of members as returned from the members service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'avatar\', \'roles\']', () => {
                expect(response.results[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'avatar', 'roles']);
            });

            it('should return members with id equal to the value returned from the members service', () => {
                expect(response.results[0].id).to.be.equal(mockMembers[0].id);
            });

            it('should return members with email equal to the value returned from the members service', () => {
                expect(response.results[0].email).to.be.equal(mockMembers[0].email);
            });

            it('should return members with fname equal to the value returned from the members service', () => {
                expect(response.results[0].fname).to.be.equal(mockMembers[0].fname);
            });

            it('should return members with lname equal to the value returned from the members service', () => {
                expect(response.results[0].lname).to.be.equal(mockMembers[0].lname);
            });

            it('should return members with roles as an array of strings', () => {
                expect(response.results[0].roles).to.be.an('array');
                response.results[0].roles.forEach(role => expect(role).to.be.a('string'));
            });
        });

        describe('adding a user to a new member', () => {
            let response: any;

            beforeEach(async () => {
                const {userId, fname, lname, email, gender} = mockMembers[0];

                memberServiceFindOneByEmailStub.resolves(null);
                memberServiceSaveStub.resolves(mockMembers[0]);

                response = await membersController.createMemberPostCognitoRegistration({
                    userId,
                    fname,
                    lname,
                    email,
                    gender,
                });
            });

            it('should return an object with key [\'results\']', () => {
                expect(response).to.have.all.keys(['results']);
            });

            it('should return the same number of members as returned from the members service', () => {
                expect(response.results).to.be.an('array').of.length(1);
            });

            it('should return each member with keys [\'id\', \'email\', \'fname\', \'lname\', \'avatar\', \'roles\']', () => {
                expect(response.results[0]).to.be.have.all.keys(['id', 'email', 'fname', 'lname', 'avatar', 'roles']);
            });

            it('should return members with id equal to the value returned from the members service', () => {
                expect(response.results[0].id).to.be.equal(mockMembers[0].id);
            });

            it('should return members with email equal to the value returned from the members service', () => {
                expect(response.results[0].email).to.be.equal(mockMembers[0].email);
            });

            it('should return members with fname equal to the value returned from the members service', () => {
                expect(response.results[0].fname).to.be.equal(mockMembers[0].fname);
            });

            it('should return members with lname equal to the value returned from the members service', () => {
                expect(response.results[0].lname).to.be.equal(mockMembers[0].lname);
            });

            it('should return members with roles as an array of strings', () => {
                expect(response.results[0].roles).to.be.an('array');
                response.results[0].roles.forEach(role => expect(role).to.be.a('string'));
            });
        });
    });
});
