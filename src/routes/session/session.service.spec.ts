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
import { UnauthorizedException } from '@nestjs/common';

/* External dependancies */
import * as moment from 'moment';

/* API dependancies */
import { SessionService } from './session.service';
import { Member } from '../members/models/members.entity';
import { Session } from './models/session.entity';
import { LoginResponse } from './models/login.interfaces';

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
}

describe('SessionService', () => {
    let memberRepository: MemberRepository;
    let sessionRepository: SessionRepository;
    let sessionService: SessionService;

    let memberRepositoryFindOneStub: SinonStub;
    let sessionRepositorySaveSpy: SinonSpy;

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

    describe('loginWithPassword()', () => {
        describe('using a valid email and password', () => {

            let email: string;
            let password: string;

            let result: LoginResponse;

            let mockMember: Member;

            const decodeJwt = (token: string) => {
                const parts = token
                    .split('.')
                    .slice(0, 2)
                    .map(str => JSON.parse(Buffer.from(str, 'base64')));

                return {
                    header: parts[0],
                    payload: parts[1],
                };
            };

            before(async () => {
                email = 'valid@email.com';
                password = 'validPass1';

                const hash = '$2a$12$olIpnzONEg7sqPvHiOXPDudxcl2eX6q278Ui7XTLj2Rd2OwYQm3yy';

                mockMember = {
                    email,
                    password: hash,
                };

                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').returns(mockMember);
                sessionRepositorySaveSpy = sinon.stub(sessionRepository, 'save').returnsArg(0);

                result = await sessionService.loginWithPassword(email, password);
            });

            after(() => {
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveSpy.restore();
            });

            describe('an accessToken', () => {

                let decodedToken: string;

                before(() => {
                    decodedToken = decodeJwt(result.accessToken);
                });

                it('should be returned', () => {
                    expect(result).to.contain.key('accessToken');
                });

                it('should be a valid JWT', () => {
                    expect(result.accessToken).to.be.a.jwt;
                });

                it('should contain [\'alg\', \'typ\', \'kid\'] in the header', () => {
                    expect(decodedToken.header).to.have.all.keys(['alg', 'typ', 'kid']);
                    expect(decodedToken.payload).to.have.all.keys(['exp', 'iat', 'iss', 'jti', 'sub']);
                });

                it('should contain [\'exp\', \'iat\', \'iss\', \'jti\', \'sub\'] in the payload', () => {
                    expect(decodedToken.payload).to.have.all.keys(['exp', 'iat', 'iss', 'jti', 'sub']);
                });

                it('should expire in 1 hour', () => {
                    const expiry = decodedToken.payload.exp * 1000;
                    const expected = +moment().add(1, 'hour');

                    expect(expiry).to.be.sameMoment(expected, 'second');
                });

                it('should contain a kid as a uuid', () => {
                    expect(decodedToken.header.kid).to.be.a.uuid('v4');
                });
            });

            describe('a refreshToken', () => {
                let decodedToken: string;

                before(() => {
                    decodedToken = decodeJwt(result.refreshToken);
                });

                it('should be returned', () => {
                    expect(result).to.contain.key('refreshToken');
                });

                it('should be a valid JWT', () => {
                    expect(result.accessToken).to.be.a.jwt;
                });

                it('should contain [\'alg\', \'typ\', \'kid\'] in the header', () => {
                    expect(decodedToken.header).to.have.all.keys(['alg', 'typ', 'kid']);
                    expect(decodedToken.payload).to.have.all.keys(['exp', 'iat', 'iss', 'jti', 'sub']);
                });

                it('should contain [\'exp\', \'iat\', \'iss\', \'jti\', \'sub\'] in the payload', () => {
                    expect(decodedToken.payload).to.have.all.keys(['exp', 'iat', 'iss', 'jti', 'sub']);
                });

                it('should expire in 7 days', () => {
                    const expiry = decodedToken.payload.exp * 1000;
                    const expected = +moment().add(7, 'days');

                    expect(expiry).to.be.sameMoment(expected, 'second');
                });

                it('should contain a kid as a uuid', () => {
                    expect(decodedToken.header.kid).to.be.a.uuid('v4');
                });
            });

            describe('a cookieToken', () => {
                it('should be returned', () => {
                    expect(result).to.contain.key('cookieToken');
                });

                it('should be 53 characters in length', () => {
                    expect(result.cookieToken).to.have.length(53);
                });
            });
        });

        describe('using an valid email and invalid password', () => {

            let email: string;
            let password: string;

            let caughtError: any;

            let result: LoginResponse;
            // let error: any;

            let mockMember: Member;

            before(async () => {
                email = 'valid@email.com';
                password = 'invalidPass1';

                const hash = '$2a$12$umd6Abrv.3siF58.GTHaeeY4xak8mzqXeNo0R6Nk3D1brXEjlWFYu';

                mockMember = {
                    email,
                    password: hash,
                };

                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').returns(mockMember);
                sessionRepositorySaveSpy = sinon.spy(sessionRepository, 'save');

                result = await sessionService.loginWithPassword(email, password);
            });

            after(() => {
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveSpy.restore();
            });

            it('should not call the session repository', () => {
                expect(sessionRepositorySaveSpy).to.have.not.been.called;
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });

        describe('using an invalid email and password', () => {

            let email: string;
            let password: string;

            let result: LoginResponse;

            let mockMember: Member;

            before(async () => {
                email = 'valid@email.com';
                password = 'invalid@email.com';

                mockMember = undefined;

                memberRepositoryFindOneStub = sinon.stub(memberRepository, 'findOne').returns(mockMember);
                sessionRepositorySaveSpy = sinon.spy(sessionRepository, 'save');

                result = await sessionService.loginWithPassword(email, password);
            });

            after(() => {
                memberRepositoryFindOneStub.restore();
                sessionRepositorySaveSpy.restore();
            });

            it('should not call the session repository', () => {
                expect(sessionRepositorySaveSpy).to.have.not.been.called;
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });
        });
    });
});