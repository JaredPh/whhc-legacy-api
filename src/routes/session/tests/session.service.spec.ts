/* Nest Testing */
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

/* Chai and chai addons */
import * as chai from 'chai';
import * as chaiJWT from 'chai-jwt';
import * as chaiMoment from 'chai-moment';
import * as chaiUUID from 'chai-uuid';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SinonSpy, SinonStub } from 'sinon';

/* Nest */
import { Repository } from 'typeorm';

/* External dependancies */
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';

/* API dependancies */
import { SessionService } from '../session.service';
import { Member } from '../../members/members.entity';
import { Session } from '../session.entity';
import { mockSession, mockSessionTokens } from './session.test-helpers';
import { mockMember, mockMemberTextPass } from '../../members/tests/members.test-helpers';

chai.use(chaiJWT);
chai.use(chaiMoment);
chai.use(chaiUUID);
chai.use(sinonChai);

const expect = chai.expect;

class MemberRepository extends Repository<Member> {
    findOne() {}
}

class SessionRepository extends Repository<Session> {
    save() {}
    findOnebyId() {}
    removeById() {}
}

describe('SessionService', () => {
    let memberRepository: MemberRepository;
    let sessionRepository: SessionRepository;
    let sessionService: SessionService;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            components: [
                SessionService,
                {
                    provide: 'SessionRepository',
                    useClass: SessionRepository,
                },
                {
                    provide: 'MemberRepository',
                    useClass: MemberRepository,
                },
            ],
        }).compile();

        memberRepository = module.get<MemberRepository>(MemberRepository);
        sessionRepository = module.get<SessionRepository>(SessionRepository);

        sessionService = module.get<SessionService>(SessionService);
    });

    describe('generateHash()', () => {
        const hashes: string[] = [];

        before(async () => {
            for (let i = 0; i < 50; i += 1) {
                hashes.push(await SessionService.generateHash('testString'));
            }
        });

        it('should generate 53 character hashes', () => {
            hashes.forEach((hash) => {
                expect(hash).to.have.length(53);
            });
        });

        it('should return a different hash each time', () => {
            hashes.forEach((hash) => {
                const count = hashes.reduce((acc, curr) => (curr === hash) ? acc + 1 : acc, 0);
                expect(count).to.be.equal(1);
            });
        });
    });

    describe('generateRefreshExpiry()', () => {
        it('should return an expiry datae using env var', () => {
            process.env.JWT_REFRESH_HOURS = 100;

            const result = SessionService.generateRefreshExpiry();
            const expected = moment().add(process.env.JWT_REFRESH_HOURS, 'hours').toDate();

            expect(result).to.be.sameMoment(expected, 'second');
        });
    });

    describe('generateSessionTokens()', () => {

        let generateTokenStub: SinonStub;

        let result: any;

        before(async () => {
            generateTokenStub = sinon.stub(SessionService, 'generateToken');

            generateTokenStub.onCall(0).resolves(mockSessionTokens.accessToken);
            generateTokenStub.onCall(1).resolves(mockSessionTokens.refreshToken);

            result = await SessionService.generateSessionTokens(mockSession);
        });

        after(() => {
            generateTokenStub.restore();
        });

        it('should call generateToken method', () => {
            expect(generateTokenStub).to.have.been.called;
            expect(generateTokenStub.callCount).to.be.equal(2);
        });

        it('should return an access token', () => {
            expect(result.accessToken).to.be.string(mockSessionTokens.accessToken);
        });

        it('should return a refresh token', () => {
            expect(result.refreshToken).to.be.string(mockSessionTokens.refreshToken);
        });

        it('should return a cookie token', () => {
            expect(result.cookieToken).to.be.string(mockSession.cookie);
        });
    });

    describe('generateToken()', () => {
        describe('using access token', () => {

            let result: any;
            let decoded: any;

            before(async () => {
                process.env.JWT_ACCESS_HOURS = 1;
                process.env.JWT_ISSUER = 'MOCKISS';
                process.env.JWT_SECRET = 'XYZ';

                result = await SessionService.generateToken('access', mockSession);

                decoded = await jwt.decode(result, { complete: true });
            });

            it('should return a jwt', () => {
                expect(result).to.be.a.jwt;
            });

            it('should be signed with the secret', () => {
                expect(result).to.be.signedWith(process.env.JWT_SECRET);
            });

            it('should have session id in the jwt header', () => {
                expect(decoded.header.kid).to.be.string(mockSession.id);
            });

            it('should have scope in the jwt payload', () => {
                expect(decoded.payload.scope).to.be.string('access');
            });

            it('should have iss in the jwt payload', () => {
                expect(decoded.payload.iss).to.be.string(process.env.JWT_ISSUER);
            });

            it('should have jti in the jwt payload', () => {
                expect(decoded.payload.jti).to.be.string(mockSession.access);
            });

            it('should have exp in the jwt payload', () => {
                const expiry = moment().add(process.env.JWT_ACCESS_HOURS, 'hours').unix();
                expect(decoded.payload.exp).to.be.equal(expiry);
            });
        });

        describe('using refresh token', () => {

            let result: any;
            let decoded: any;

            before(async () => {
                process.env.JWT_ISSUER = 'MOCKISS';
                process.env.JWT_SECRET = 'ABC';

                result = await SessionService.generateToken('refresh', mockSession);

                decoded = await jwt.decode(result, { complete: true });
            });

            it('should return a jwt', () => {
                expect(result).to.be.a.jwt;
            });

            it('should be signed with the secret', () => {
                expect(result).to.be.signedWith(process.env.JWT_SECRET);
            });

            it('should have session id in the jwt header', () => {
                expect(decoded.header.kid).to.be.string(mockSession.id);
            });

            it('should have scope in the jwt payload', () => {
                expect(decoded.payload.scope).to.be.string('refresh');
            });

            it('should have iss in the jwt payload', () => {
                expect(decoded.payload.iss).to.be.string(process.env.JWT_ISSUER);
            });

            it('should have jti in the jwt payload', () => {
                expect(decoded.payload.jti).to.be.string(mockSession.refresh);
            });

            it('should have exp in the jwt payload', () => {
                const expiry = moment(mockSession.expiry).unix();
                expect(decoded.payload.exp).to.be.equal(expiry);
            });
        });
    });

    describe('getTokenFromHeaders', () => {

        let result: any;

        describe('with a valid authorization header', () => {

            let mockHeaders: { [key: string]: string };

            before(() => {
                mockHeaders = {
                    'content-type': 'application/json',
                    authorization: `Bearer ${mockSessionTokens.accessToken}`,
                };

                result = SessionService.getTokenFromHeaders(mockHeaders);
            });

            it('should return the jwt', () => {
                expect(result).to.be.string(mockSessionTokens.accessToken);
            });
        });

        describe('with an invalid authorization header', () => {

            let mockHeaders: { [key: string]: string };

            before(() => {
                mockHeaders = {
                    'content-type': 'application/json',
                    authorization: `Basic ${mockSessionTokens.accessToken}`,
                };

                result = SessionService.getTokenFromHeaders(mockHeaders);
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });

        describe('with no authorization header', () => {

            let mockHeaders: { [key: string]: string };

            before(() => {
                mockHeaders = {
                    'content-type': 'application/json',
                };

                result = SessionService.getTokenFromHeaders(mockHeaders);
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });
    });

    describe('loginWithPassword', () => {

        let generateHashStub: SinonStub;
        let generateRefreshExpiryStub: SinonStub;
        let generateSessionTokensStub: SinonStub;
        let memberRepositoryFindOneStub: SinonStub;
        let sessionRepositorySaveStub: SinonStub;

        describe('using a valid email and password', () => {
            let result;
            let mockExpiryDate;

            before(async () => {
                mockExpiryDate = mockSession.expiry;

                generateHashStub = sinon.stub(SessionService, 'generateHash');

                generateHashStub.onCall(0).resolves('mockHash0');
                generateHashStub.onCall(1).resolves('mockHash1');
                generateHashStub.onCall(2).resolves('mockHash2');

                generateRefreshExpiryStub = sinon.stub(SessionService, 'generateRefreshExpiry').returns(mockExpiryDate);
                generateSessionTokensStub = sinon.stub(SessionService, 'generateSessionTokens').returns(mockSessionTokens);
                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(mockMember);
                sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);

                result = await sessionService.loginWithPassword(mockMember.email, mockMemberTextPass);
            });

            after(() => {
                generateHashStub.restore();
                generateRefreshExpiryStub.restore();
                generateSessionTokensStub.restore();
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveStub.restore();
            });

            it('should call generateHash method', () => {
                expect(generateHashStub).to.have.been.called;
                expect(generateHashStub.callCount).to.be.equal(3);
            });

            it('should generate a session id', () => {
                const id = generateHashStub.getCall(0).args[0];
                expect(id).to.be.a.uuid('v4');
            });

            it('should call generateSessionTokens method', () => {
                expect(generateSessionTokensStub).to.have.been.called;
                expect(generateSessionTokensStub.callCount).to.be.equal(1);
            });

            it('should call generateRefreshExpiry method', () => {
                expect(generateRefreshExpiryStub).to.have.been.called;
                expect(generateRefreshExpiryStub.callCount).to.be.equal(1);
            });

            it('should call the save method of the session respository', () => {
                expect(sessionRepositorySaveStub).to.have.been.called;
                expect(sessionRepositorySaveStub.callCount).to.be.equal(1);
            });

            it('should set the access token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].access;

                expect(token).to.be.string('mockHash1');
            });

            it('should set the refresh token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].refresh;

                expect(token).to.be.string('mockHash2');
            });

            it('should set the cookie token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].cookie;

                expect(token).to.be.string('mockHash0');
            });

            it('should set the expiry time saved in the session respository', () => {
                const expiry = sessionRepositorySaveStub.getCall(0).args[0].expiry;

                expect(expiry.getTime()).to.be.equal(mockExpiryDate.getTime());
            });

            it('should return an access token', () => {
                expect(result.accessToken).to.be.string(mockSessionTokens.accessToken);
            });

            it('should return a refresh token', () => {
                expect(result.refreshToken).to.be.string(mockSessionTokens.refreshToken);
            });

            it('should return a cookie token', () => {
                expect(result.cookieToken).to.be.string(mockSessionTokens.cookieToken);
            });
        });

        describe('using an valid email and invalid password', () => {
            let result;

            before(async () => {
                generateHashStub = sinon.stub(SessionService, 'generateHash');
                generateRefreshExpiryStub = sinon.stub(SessionService, 'generateRefreshExpiry');
                generateSessionTokensStub = sinon.stub(SessionService, 'generateSessionTokens');
                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(mockMember);
                sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save');

                result = await sessionService.loginWithPassword(mockMember.email, mockMemberTextPass + 'x');
            });

            after(() => {
                generateHashStub.restore();
                generateRefreshExpiryStub.restore();
                generateSessionTokensStub.restore();
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveStub.restore();
            });

            it('should not call generateHash method', () => {
                expect(generateHashStub).to.not.have.been.called;
            });

            it('should call generateSessionTokens method', () => {
                expect(generateSessionTokensStub).to.not.have.been.called;
            });

            it('should call generateRefreshExpiry method', () => {
                expect(generateRefreshExpiryStub).to.not.have.been.called;
            });

            it('should call the save method of the session respository', () => {
                expect(sessionRepositorySaveStub).to.not.have.been.called;
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });

        describe('using an invalid email and password', () => {
            let result;

            before(async () => {
                generateHashStub = sinon.stub(SessionService, 'generateHash');
                generateRefreshExpiryStub = sinon.stub(SessionService, 'generateRefreshExpiry');
                generateSessionTokensStub = sinon.stub(SessionService, 'generateSessionTokens');
                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').resolves(undefined);
                sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);

                result = await sessionService.loginWithPassword(mockMember.email, mockMemberTextPass);
            });

            after(() => {
                generateHashStub.restore();
                generateRefreshExpiryStub.restore();
                generateSessionTokensStub.restore();
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveStub.restore();
            });

            it('should not call generateHash method', () => {
                expect(generateHashStub).to.not.have.been.called;
            });

            it('should call generateSessionTokens method', () => {
                expect(generateSessionTokensStub).to.not.have.been.called;
            });

            it('should call generateRefreshExpiry method', () => {
                expect(generateRefreshExpiryStub).to.not.have.been.called;
            });

            it('should call the save method of the session respository', () => {
                expect(sessionRepositorySaveStub).to.not.have.been.called;
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });
    });

    describe('refreshTokens()', () => {
        let generateHashStub: SinonStub;
        let generateRefreshExpiryStub: SinonStub;
        let generateSessionTokensStub: SinonStub;
        let sessionRepositorySaveStub: SinonStub;

        let mockExpiryDate: Date;

        let result: any;

        beforeEach(async () => {
            mockExpiryDate = new Date();

            sessionRepositorySaveStub = sinon.stub(sessionRepository, 'save').returnsArg(0);

            generateHashStub = sinon.stub(SessionService, 'generateHash');
            generateHashStub.onCall(0).resolves('mockHash0');
            generateHashStub.onCall(1).resolves('mockHash1');

            generateSessionTokensStub  = sinon.stub(SessionService, 'generateSessionTokens').resolves(mockSessionTokens);
            generateRefreshExpiryStub = sinon.stub(SessionService, 'generateRefreshExpiry').returns(mockExpiryDate);
        });

        afterEach(() => {
            sessionRepositorySaveStub.restore();

            generateHashStub.restore();
            generateSessionTokensStub.restore();
            generateRefreshExpiryStub.restore();
        });

        describe('with a valid session', () => {

            let sessionRepositoryFindOneByIdStub: SinonStub;

            beforeEach(async () => {
                sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(mockSession);

                result = await sessionService.refreshTokens(mockSession.id);
            });

            afterEach(() => {
                sessionRepositoryFindOneByIdStub.restore();
            });

            it('should call generateHash method', () => {
                expect(generateHashStub).to.have.been.called;
                expect(generateHashStub.callCount).to.be.equal(2);
            });

            it('should call generateSessionTokens method', () => {
                expect(generateSessionTokensStub).to.have.been.called;
                expect(generateSessionTokensStub.callCount).to.be.equal(1);
            });

            it('should call generateRefreshExpiry method', () => {
                expect(generateRefreshExpiryStub).to.have.been.called;
                expect(generateRefreshExpiryStub.callCount).to.be.equal(1);
            });

            it('should call the save method of the session respository', () => {
                expect(sessionRepositorySaveStub).to.have.been.called;
                expect(sessionRepositorySaveStub.callCount).to.be.equal(1);
            });

            it('should update the access token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].access;

                expect(token).to.be.string('mockHash0');
            });

            it('should update the refresh token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].refresh;

                expect(token).to.be.string('mockHash1');
            });

            it('should not update the cookie token saved in the session respository', () => {
                const token = sessionRepositorySaveStub.getCall(0).args[0].cookie;

                expect(token).to.be.string(mockSession.cookie);
            });

            it('should update the expiry time saved in the session respository', () => {
                const expiry = sessionRepositorySaveStub.getCall(0).args[0].expiry;

                expect(expiry.getTime()).to.be.equal(mockExpiryDate.getTime());
            });

            it('should return an access token', () => {
                expect(result.accessToken).to.be.string(mockSessionTokens.accessToken);
            });

            it('should return a refresh token', () => {
                expect(result.refreshToken).to.be.string(mockSessionTokens.refreshToken);
            });

            it('should return a cookie token', () => {
                expect(result.cookieToken).to.be.string(mockSessionTokens.cookieToken);
            });
        });

        describe('with a invalid session', () => {

            let sessionRepositoryFindOneByIdStub: SinonStub;

            beforeEach(async () => {
                sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').resolves(undefined);

                result = await sessionService.refreshTokens(undefined);
            });

            afterEach(() => {
                sessionRepositoryFindOneByIdStub.restore();
            });

            it('should not call generateHash method', () => {
                expect(generateHashStub).to.not.have.been.called;
            });

            it('should not call generateSessionTokens method', () => {
                expect(generateSessionTokensStub).to.not.have.been.called;
            });

            it('should not call generateRefreshExpiry method', () => {
                expect(generateRefreshExpiryStub).to.not.have.been.called;
            });

            it('should not the save method of the session respository', () => {
                expect(sessionRepositorySaveStub).to.not.have.been.called;
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });
    });

    describe('removeSession()', () => {

        let sessionRepositoryRemoveByIdStub: SinonStub;

        before(() => {
            sessionRepositoryRemoveByIdStub = sinon.stub(sessionRepository, 'removeById').resolves(undefined);
        });

        after(() => {
           sessionRepositoryRemoveByIdStub.restore();
        });

        it('should call the session repository removeById method', () => {
            sessionService.removeSession(123);

            expect(sessionRepositoryRemoveByIdStub).to.have.been.calledWith(123);
        });
    });

    describe('validateSession()', () => {

        let sessionRepositoryFindOneByIdStub: SinonStub;

        const session: Session = mockSession;

        describe('when validating a valid session', () => {

            let result: any; // todo: add type;

            before(async () => {
                sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').returns(session);
                result = await sessionService.validateSession(session.id, 'access', session.access, session.cookie);
            });

            after(() => {
                sessionRepositoryFindOneByIdStub.restore();
            });

            it('should return \'hasValidToken\' as true', () => {
                expect(result.hasValidToken).to.be.true;
            });

            it('should return \'hasValidId\' as true', () => {
                expect(result.hasValidId).to.be.true;
            });

            it('should return \'hasValidCookie\' as true', () => {
                expect(result.hasValidCookie).to.be.true;
            });

            it('should return \'isValidSession\' as true', () => {
                expect(result.isValidSession).to.be.true;
            });

            it('should return matching \'memberId\'', () => {
                expect(result.memberId).to.be.equal(session.member);
            });
        });

        describe('when validating an invalid session', () => {

            describe('with an incorrect access token', () => {
                let result: any; // todo: add type;

                before(async () => {
                    sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').returns(session);
                    result = await sessionService.validateSession(session.id, 'access', 'invalidToken123', session.cookie);
                });

                after(() => {
                    sessionRepositoryFindOneByIdStub.restore();
                });

                it('should return \'hasValidToken\' as false', () => {
                    expect(result.hasValidToken).to.be.false;
                });

                it('should return \'hasValidId\' as true', () => {
                    expect(result.hasValidId).to.be.true;
                });

                it('should return \'hasValidCookie\' as true', () => {
                    expect(result.hasValidCookie).to.be.true;
                });

                it('should return \'isValidSession\' as false', () => {
                    expect(result.isValidSession).to.be.false;
                });

                it('should return matching \'memberId\'', () => {
                    expect(result.memberId).to.be.equal(session.member);
                });
            });

            describe('with an incorrect refresh token', () => {
                let result: any; // todo: add type;

                before(async () => {
                    sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').returns(session);
                    result = await sessionService.validateSession(session.id, 'refresh', 'invalidToken123', session.cookie);
                });

                after(() => {
                    sessionRepositoryFindOneByIdStub.restore();
                });

                it('should return \'hasValidToken\' as false', () => {
                    expect(result.hasValidToken).to.be.false;
                });

                it('should return \'hasValidId\' as true', () => {
                    expect(result.hasValidId).to.be.true;
                });

                it('should return \'hasValidCookie\' as true', () => {
                    expect(result.hasValidCookie).to.be.true;
                });

                it('should return \'isValidSession\' as false', () => {
                    expect(result.isValidSession).to.be.false;
                });

                it('should return matching \'memberId\'', () => {
                    expect(result.memberId).to.be.equal(session.member);
                });
            });

            describe('with an incorrect cookie token', () => {
                let result: any; // todo: add type;

                before(async () => {
                    sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').returns(session);
                    result = await sessionService.validateSession(session.id, 'access', session.access, 'invalidToken123');
                });

                after(() => {
                    sessionRepositoryFindOneByIdStub.restore();
                });

                it('should return \'hasValidToken\' as true', () => {
                    expect(result.hasValidToken).to.be.true;
                });

                it('should return \'hasValidId\' as true', () => {
                    expect(result.hasValidId).to.be.true;
                });

                it('should return \'hasValidCookie\' as false', () => {
                    expect(result.hasValidCookie).to.be.false;
                });

                it('should return \'isValidSession\' as false', () => {
                    expect(result.isValidSession).to.be.false;
                });

                it('should return matching \'memberId\'', () => {
                    expect(result.memberId).to.be.equal(session.member);
                });
            });

            describe('with an incorrect session id', () => {
                let result: any; // todo: add type;

                before(async () => {
                    sessionRepositoryFindOneByIdStub = sinon.stub(sessionRepository, 'findOneById').returns(undefined);
                    result = await sessionService.validateSession(123, 'access', session.access, session.cookie);
                });

                after(() => {
                    sessionRepositoryFindOneByIdStub.restore();
                });

                it('should return \'hasValidToken\' as false', () => {
                    expect(result.hasValidToken).to.be.false;
                });

                it('should return \'hasValidId\' as false', () => {
                    expect(result.hasValidId).to.be.false;
                });

                it('should return \'hasValidCookie\' as false', () => {
                    expect(result.hasValidCookie).to.be.false;
                });

                it('should return \'isValidSession\' as false', () => {
                    expect(result.isValidSession).to.be.false;
                });

                it('should return matching \'memberId\'', () => {
                    expect(result.memberId).to.be.equal(null);
                });
            });
        });
    });

    describe('verifyAndDecodeToken()', () => {
        let token: string;

        before(async () => {
            process.env.JWT_SECRET = 'ABC';
            process.env.JWT_ISSUER = 'XYZ';

            const payload = { exp: moment().add(1, 'hour').unix() };

            const options = {
                issuer: process.env.JWT_ISSUER,
                jwtid: 'mockToken',
                keyid: 'mockSessionId',
                subject: 'access',
            };

            token = await jwt.sign(payload, process.env.JWT_SECRET, options);

        });

        describe('with a valid JWT', () => {
            let result: any;

            before(async () => {
                result = await SessionService.verifyAndDecodeToken(token);
            });

            it('should return object containing [\'sessionId\', \'token\', \'type\']', () => {
                expect(result).to.be.an('object');
                expect(result).to.have.all.keys(['sessionId', 'token', 'type']);
            });

            it('should return \'kid\' as sessionId', () => {
                expect(result.sessionId).to.be.string('mockSessionId');
            });

            it('should return \'jti\' as token', () => {
                expect(result.token).to.be.string('mockToken');
            });

            it('should return \'sub\' as type', () => {
                expect(result.type).to.be.string('access');
            });
        });

        describe('with a tampered JWT', () => {
            it('should return null', async () => {
                const result = await SessionService.verifyAndDecodeToken(token + 'x');
                expect(result).to.be.null;
            });
        });
    });
});