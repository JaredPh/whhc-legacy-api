import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Repository } from 'typeorm';

import { Member } from '../../members/members.entity';

import { mockJwtTokens, mockJwtSecret, mockSession, mockJwtIssuer } from './session.test-helpers';
import { mockMember, mockMemberTextPass } from '../../members/tests/members.test-helpers';
import { MembersService } from '../members.service';
import { mockMembers } from './members.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

class MemberRepository extends Repository<Member> {
    find() {}
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
            memberRepositoryFindStub = sinon.stub(memberRepository, 'find')
                .resolves(mockMembers);

            result = await membersService.findAll();
        });

        after(() => {
            memberRepositoryFindStub.restore();
        });

        it('should return members from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers);
        });
    });
    //     describe('with no authorization header', () => {
    //         let mockRequest: any;
    //         let result: any;
    //
    //         before(async () => {
    //             mockRequest = {
    //                 headers: {},
    //                 cookies: {
    //                     'CSRF-TOKEN': mockSession.cookie,
    //                 },
    //             };
    //
    //             sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);
    //
    //             result = await sessionService.loadSession(mockRequest);
    //         });
    //
    //         after(() => {
    //             sessionRepositoryFindOneByIdStub.restore();
    //         });
    //
    //         it('should not call the session repository', () => {
    //             expect(sessionRepositoryFindOneByIdStub).to.not.be.called;
    //         });
    //
    //         it('should return an object with \'session\' and \'token\'', () => {
    //             expect(result).to.have.all.keys(['session', 'token']);
    //         });
    //
    //         it('should return session as null', () => {
    //             expect(result.session).to.be.null;
    //         });
    //
    //         it('should return token with \'verified\' and  \'type\'', () => {
    //             expect(result.token).to.have.all.keys(['verified', 'type']);
    //         });
    //
    //         it('should return token with verified as undefined', () => {
    //             expect(result.token.verified).to.be.undefined;
    //         });
    //
    //         it('should return token with type as access', () => {
    //             expect(result.token.type).to.be.string('invalid');
    //         });
    //     });
    //
    //     describe('with an unreadable token', () => {
    //         let mockRequest: any;
    //         let sessionRepositoryFindOneByIdStub: SinonStub;
    //         let result: any;
    //
    //         before(async () => {
    //             const token = mockJwtTokens.accessToken;
    //
    //             mockRequest = {
    //                 headers: {
    //                     authorization: `Bearer abc${token}`,
    //                 },
    //                 cookies: {
    //                     'CSRF-TOKEN': mockSession.cookie,
    //                 },
    //             };
    //
    //             sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);
    //
    //             result = await sessionService.loadSession(mockRequest);
    //         });
    //
    //         after(() => {
    //             sessionRepositoryFindOneByIdStub.restore();
    //         });
    //
    //         it('should return an object with \'session\' and \'token\'', () => {
    //             expect(result).to.have.all.keys(['session', 'token']);
    //         });
    //
    //         it('should return session as null', () => {
    //             expect(result.session).to.be.null;
    //         });
    //
    //         it('should return token with \'verified\' and  \'type\'', () => {
    //             expect(result.token).to.have.all.keys(['verified', 'type']);
    //         });
    //
    //         it('should return token with verified as false', () => {
    //             expect(result.token.verified).to.be.false;
    //         });
    //
    //         it('should return token with type as null', () => {
    //             expect(result.token.type).to.be.null;
    //         });
    //     });
    //
    //     describe('with a tampered token', () => {
    //         let mockRequest: any;
    //         let sessionRepositoryFindOneByIdStub: SinonStub;
    //         before(async () => {
    //             const token = mockJwtTokens.accessToken;
    //
    //             mockRequest = {
    //                 headers: {
    //                     authorization: `Bearer ${token}xyz`,
    //                 },
    //                 cookies: {
    //                     'CSRF-TOKEN': mockSession.cookie,
    //                 },
    //             };
    //
    //             sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);
    //
    //             result = await sessionService.loadSession(mockRequest);
    //         });
    //
    //         let result: any;
    //
    //         after(() => {
    //             sessionRepositoryFindOneByIdStub.restore();
    //         });
    //
    //         it('should return an object with \'session\' and \'token\'', () => {
    //             expect(result).to.have.all.keys(['session', 'token']);
    //         });
    //
    //         it('should return a valid session', () => {
    //             expect(result.session).to.deep.equal(mockSession);
    //         });
    //
    //         it('should return token with \'verified\' and  \'type\'', () => {
    //             expect(result.token).to.have.all.keys(['verified', 'type']);
    //         });
    //
    //         it('should return token with verified as false', () => {
    //             expect(result.token.verified).to.be.false;
    //         });
    //
    //         it('should return token with type as access', () => {
    //             expect(result.token.type).to.be.string('access');
    //         });
    //     });
    //
    //     describe('with a valid accessToken', () => {
    //         let mockRequest: any;
    //         let sessionRepositoryFindOneByIdStub: SinonStub;
    //         let result: any;
    //
    //         before(async () => {
    //             const token = mockJwtTokens.accessToken;
    //
    //             mockRequest = {
    //                 headers: {
    //                     authorization: `Bearer ${token}`,
    //                 },
    //                 cookies: {
    //                     'CSRF-TOKEN': mockSession.cookie,
    //                 },
    //             };
    //
    //             sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);
    //
    //             result = await sessionService.loadSession(mockRequest);
    //         });
    //
    //         after(() => {
    //             sessionRepositoryFindOneByIdStub.restore();
    //         });
    //
    //         it('should return an object with \'session\' and \'token\'', () => {
    //             expect(result).to.have.all.keys(['session', 'token']);
    //         });
    //
    //         it('should return a valid session', () => {
    //             expect(result.session).to.deep.equal(mockSession);
    //         });
    //
    //         it('should return token with \'verified\' and  \'type\'', () => {
    //             expect(result.token).to.have.all.keys(['verified', 'type']);
    //         });
    //
    //         it('should return token with verified as true', () => {
    //             expect(result.token.verified).to.be.true;
    //         });
    //
    //         it('should return token with type as access', () => {
    //             expect(result.token.type).to.be.string('access');
    //         });
    //     });
    //
    //     describe('with a valid refreshToken', () => {
    //         let mockRequest: any;
    //         let sessionRepositoryFindOneByIdStub: SinonStub;
    //         let result: any;
    //
    //         before(async () => {
    //             const token = mockJwtTokens.refreshToken;
    //
    //             mockRequest = {
    //                 headers: {
    //                     authorization: `Bearer ${token}`,
    //                 },
    //                 cookies: {
    //                     'CSRF-TOKEN': mockSession.cookie,
    //                 },
    //             };
    //
    //             sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);
    //
    //             result = await sessionService.loadSession(mockRequest);
    //         });
    //
    //         after(() => {
    //             sessionRepositoryFindOneByIdStub.restore();
    //         });
    //
    //         it('should return an object with \'session\' and \'token\'', () => {
    //             expect(result).to.have.all.keys(['session', 'token']);
    //         });
    //
    //         it('should return a valid session', () => {
    //             expect(result.session).to.deep.equal(mockSession);
    //         });
    //
    //         it('should return token with \'verified\' and  \'type\'', () => {
    //             expect(result.token).to.have.all.keys(['verified', 'type']);
    //         });
    //
    //         it('should return token with verified as true', () => {
    //             expect(result.token.verified).to.be.true;
    //         });
    //
    //         it('should return token with type as access', () => {
    //             expect(result.token.type).to.be.string('refresh');
    //         });
    //     });
    // });
    //
    // // todo: test for jwt exp
    // describe('loginWithPassword()', () => {
    //
    //     describe('using a valid email and password', () => {
    //         let result;
    //         let mockExpiryDate;
    //
    //         let memberRepositoryFindOneStub: sinonStub;
    //         let sessionRepositorySaveStub: sinonStub;
    //
    //         before(async () => {
    //             mockExpiryDate = mockSession.expiry;
    //
    //             memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(mockMember);
    //             sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);
    //
    //             result = await sessionService.loginWithPassword(mockMember.email, mockMemberTextPass);
    //         });
    //
    //         after(() => {
    //             memberRepositoryFindOneStub.restore();
    //             sessionRepositorySaveStub.restore();
    //         });
    //
    //         describe('creating the session', () => {
    //
    //             it('should call the session repository save method', () => {
    //                 expect(sessionRepositorySaveStub).to.have.been.called;
    //             });
    //
    //             it('should generate a sessionId id', () => {
    //                 const id = sessionRepositorySaveStub.getCall(0).args[0].id;
    //                 expect(id).to.be.a.uuid('v4');
    //             });
    //
    //             it('should create an access token', () => {
    //                 const access = sessionRepositorySaveStub.getCall(0).args[0].access;
    //
    //                 expect(access).to.be.a('string');
    //                 expect(access).to.be.length(53);
    //             });
    //
    //             it('should create a access token', () => {
    //                 const refresh = sessionRepositorySaveStub.getCall(0).args[0].refresh;
    //
    //                 expect(refresh).to.be.a('string');
    //                 expect(refresh).to.be.length(53);
    //             });
    //
    //             it('should create a cookie token', () => {
    //                 const cookie = sessionRepositorySaveStub.getCall(0).args[0].cookie;
    //
    //                 expect(cookie).to.be.a('string');
    //                 expect(cookie).to.be.length(53);
    //             });
    //
    //             it('should generate an expiry', () => {
    //                 const expiry = sessionRepositorySaveStub.getCall(0).args[0].expiry;
    //                 const expectedExpiry = moment().add(process.env.JWT_REFRESH_HOURS, 'hours').toDate();
    //
    //                 expect(expiry).to.be.sameMoment(expectedExpiry, 'second');
    //             });
    //         });
    //
    //         describe('the response', () => {
    //             let decodedAccessToken: any;
    //             let decodedRefreshToken: any;
    //
    //             before(async () => {
    //                 decodedAccessToken = await jwt.decode(result.accessToken, { complete: true });
    //                 decodedRefreshToken = await jwt.decode(result.refreshToken, { complete: true });
    //             });
    //
    //             it('should return an object containing \'accessToken\', \'refreshToken\', and \'cookieToken\'', () => {
    //                 expect(result).to.have.all.keys(['accessToken', 'refreshToken', 'cookieToken']);
    //             });
    //
    //             it('should return the accessToken as a jwt', () => {
    //                 expect(result.accessToken).to.be.jwt;
    //             });
    //
    //             it('should return the accessToken with kid equal to sessionId', async () => {
    //                 const id = sessionRepositorySaveStub.getCall(0).args[0].id;
    //
    //                 expect(decodedAccessToken.header.kid).to.be.string(id);
    //             });
    //
    //             it('should return the accessToken with scope equal to \'access\'', async () => {
    //                 expect(decodedAccessToken.payload.scope).to.be.string('access');
    //             });
    //
    //             it('should return the accessToken with jti equal to session access token', async () => {
    //                 const updatedAccess = sessionRepositorySaveStub.getCall(0).args[0].access;
    //
    //                 expect(decodedAccessToken.payload.jti).to.be.string(updatedAccess);
    //             });
    //
    //             it('should return the refreshToken as a jwt', () => {
    //                 expect(result.refreshToken).to.be.jwt;
    //             });
    //
    //             it('should return the refreshToken with kid equal to sessionId', async () => {
    //                 const id = sessionRepositorySaveStub.getCall(0).args[0].id;
    //
    //                 expect(decodedAccessToken.header.kid).to.be.string(id);
    //             });
    //
    //             it('should return the refreshToken with scope equal to \'access\'', async () => {
    //                 expect(decodedRefreshToken.payload.scope).to.be.string('refresh');
    //             });
    //
    //             it('should return the refreshToken with jti equal to session access token', async () => {
    //                 const updatedRefresh = sessionRepositorySaveStub.getCall(0).args[0].refresh;
    //
    //                 expect(decodedRefreshToken.payload.jti).to.be.string(updatedRefresh);
    //             });
    //         });
    //     });
    //
    //     describe('using an valid email and invalid password', () => {
    //         let result;
    //
    //         let memberRepositoryFindOneStub: sinonStub;
    //         let sessionRepositorySaveStub: sinonStub;
    //
    //         before(async () => {
    //             memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(mockMember);
    //             sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);
    //
    //             result = await sessionService.loginWithPassword(mockMember.email, 'invalidPass1');
    //         });
    //
    //         after(() => {
    //             memberRepositoryFindOneStub.restore();
    //             sessionRepositorySaveStub.restore();
    //         });
    //
    //         it('should not call the session repository save method', () => {
    //             expect(sessionRepositorySaveStub).to.not.have.been.called;
    //         });
    //
    //         it('should return null', () => {
    //             expect(result).to.be.null;
    //         });
    //     });
    //
    //     describe('using an invalid email and password', () => {
    //         let result;
    //
    //         let memberRepositoryFindOneStub: sinonStub;
    //         let sessionRepositorySaveStub: sinonStub;
    //
    //         before(async () => {
    //             memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(undefined);
    //             sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);
    //
    //             result = await sessionService.loginWithPassword(mockMember.email, 'somePass1');
    //         });
    //
    //         after(() => {
    //             memberRepositoryFindOneStub.restore();
    //             sessionRepositorySaveStub.restore();
    //         });
    //
    //         it('should not call the session repository save method', () => {
    //             expect(sessionRepositorySaveStub).to.not.have.been.called;
    //         });
    //
    //         it('should return null', () => {
    //             expect(result).to.be.null;
    //         });
    //     });
    // });
    // // todo: test for jwt exp
    // describe('refreshTokens()', () => {
    //     let result: ESession;
    //     let sessionRepositorySaveStub: SinonStub;
    //
    //     const {
    //         access,
    //         refresh,
    //         cookie,
    //     } = mockSession;
    //
    //     before(async () => {
    //         sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);
    //         result = await sessionService.refreshTokens(mockSession);
    //     });
    //
    //     after(() => {
    //         sessionRepositorySaveStub.restore();
    //     });
    //
    //     describe('updating the session', () => {
    //         it('should call the session repository save method', () => {
    //             expect(sessionRepositorySaveStub).to.have.been.called;
    //         });
    //
    //         it('should update the access token', () => {
    //             const updatedAccess = sessionRepositorySaveStub.getCall(0).args[0].access;
    //
    //             expect(updatedAccess).to.be.a('string');
    //             expect(updatedAccess).to.be.length(53);
    //             expect(updatedAccess).not.to.be.string(access);
    //         });
    //
    //         it('should update the access token', () => {
    //             const updatedRefresh = sessionRepositorySaveStub.getCall(0).args[0].refresh;
    //
    //             expect(updatedRefresh).to.be.a('string');
    //             expect(updatedRefresh).to.be.length(53);
    //             expect(updatedRefresh).not.to.be.string(refresh);
    //         });
    //
    //         it('should not update the cookie token', () => {
    //             const updatedCookie = sessionRepositorySaveStub.getCall(0).args[0].cookie;
    //
    //             expect(updatedCookie).to.be.string(cookie);
    //         });
    //
    //         it('should extend the expiry', () => {
    //             const updatedExpiry = sessionRepositorySaveStub.getCall(0).args[0].expiry;
    //             const expectedExpiry = moment().add(process.env.JWT_REFRESH_HOURS, 'hours').toDate();
    //
    //             expect(updatedExpiry).to.be.sameMoment(expectedExpiry, 'second');
    //         });
    //     });
    //
    //     describe('the response', () => {
    //         let decodedAccessToken: any;
    //         let decodedRefreshToken: any;
    //
    //         before(async () => {
    //             decodedAccessToken = await jwt.decode(result.accessToken, { complete: true });
    //             decodedRefreshToken = await jwt.decode(result.refreshToken, { complete: true });
    //         });
    //
    //         it('should return an object containing \'accessToken\', \'refreshToken\', and \'cookieToken\'', () => {
    //             expect(result).to.have.all.keys(['accessToken', 'refreshToken', 'cookieToken']);
    //         });
    //
    //         it('should return the accessToken as a jwt', () => {
    //             expect(result.accessToken).to.be.jwt;
    //         });
    //
    //         it('should return the accessToken with kid equal to sessionId', async () => {
    //             expect(decodedAccessToken.header.kid).to.be.string(mockSession.id);
    //         });
    //
    //         it('should return the accessToken with scope equal to \'access\'', async () => {
    //             expect(decodedAccessToken.payload.scope).to.be.string('access');
    //         });
    //
    //         it('should return the accessToken with jti equal to session access token', async () => {
    //             const updatedAccess = sessionRepositorySaveStub.getCall(0).args[0].access;
    //
    //             expect(decodedAccessToken.payload.jti).to.be.string(updatedAccess);
    //         });
    //
    //         it('should return the refreshToken as a jwt', () => {
    //             expect(result.refreshToken).to.be.jwt;
    //         });
    //
    //         it('should return the refreshToken with kid equal to sessionId', async () => {
    //             expect(decodedRefreshToken.header.kid).to.be.string(mockSession.id);
    //         });
    //
    //         it('should return the refreshToken with scope equal to \'access\'', async () => {
    //             expect(decodedRefreshToken.payload.scope).to.be.string('refresh');
    //         });
    //
    //         it('should return the refreshToken with jti equal to session access token', async () => {
    //             const updatedRefresh = sessionRepositorySaveStub.getCall(0).args[0].refresh;
    //
    //             expect(decodedRefreshToken.payload.jti).to.be.string(updatedRefresh);
    //         });
    //     });
    // });
    //
    // describe('removeSession()', () => {
    //
    //     let sessionRepositoryRemoveByIdStub: SinonStub;
    //
    //     before(() => {
    //         sessionRepositoryRemoveByIdStub = sinon.stub(sessionRepository, 'removeById').resolves(undefined);
    //     });
    //
    //     after(() => {
    //         sessionRepositoryRemoveByIdStub.restore();
    //     });
    //
    //     it('should call the sessionId repository removeById method', () => {
    //         sessionService.removeSession(123);
    //         expect(sessionRepositoryRemoveByIdStub).to.have.been.calledWith(123);
    //     });
    // });
});
