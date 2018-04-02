/* Nest Testing  */
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

/* Chai and addons */
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SinonSpy } from 'sinon';

/* Nest */
import { Request } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/* API dependancies */
import { SessionController } from '../session.controller';
import { SessionRequest } from '../session.models';
import { SessionTokenResponse, SessionTokens } from '../session.interfaces';

/* API Test dependancies */
import { mockSession, mockSessionTokens } from './session.test-helpers';

chai.use(sinonChai);

const expect = chai.expect;

class SessionService {
    loginWithPassword() {}
    refreshTokens() {}
}

describe('SessionController', () => {
    let sessionService: SessionService;
    let sessionController: SessionController;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                SessionController,
            ],
            components: [
                {
                    provide: 'SessionService',
                    useClass: SessionService,
                },
            ],
        }).compile();

        sessionService = module.get<SessionService>(SessionService);
        sessionController = module.get<SessionController>(SessionController);
    });

    describe('login()', () => {

        describe('when the service returns loginTokens', () => {
            let sessionServiceLoginSpy: SinonSpy;
            let resCookieSpy: SinonSpy;
            let result: SessionTokenResponse;
            let req: Request;

            before(async () => {
                const credentials: SessionRequest = {
                    email: 'valid@email.com',
                    password: 'validPass1',
                };

                req = {
                    res: {
                        cookie: () => {},
                    },
                };

                sessionServiceLoginSpy = sinon
                    .stub(sessionService, 'loginWithPassword')
                    .resolves(mockSessionTokens);

                resCookieSpy = sinon.spy(req.res, 'cookie');

                result = await sessionController.login(req, credentials);
            });

            after(() => {
                sessionServiceLoginSpy.restore();
                resCookieSpy.restore();
            });

            it('should call the session service', () => {
                expect(sessionServiceLoginSpy).to.have.been.called;
            });

            it('should add a cookie to the response', () => {
                expect(resCookieSpy).to.have.been.calledWith('CSRF-TOKEN', mockSessionTokens.cookieToken, { httpOnly: true, secure: false });
            });

            it('should return an access token in the body', () => {
                expect(result).to.contain.key('accessToken');
                expect(result.accessToken).to.be.a('string');
                expect(result.accessToken).to.be.string(mockSessionTokens.accessToken);
            });

            it('should return a refresh token in the body', () => {
                expect(result).to.contain.key('refreshToken');
                expect(result.refreshToken).to.be.a('string');
                expect(result.refreshToken).to.be.string(mockSessionTokens.refreshToken);
            });

            it('should not return the cookie token in the body', () => {
                expect(result).not.to.contain.key('cookieToken');
            });
        });

        describe('when the service returns null', () => {
            let sessionServiceLoginStub: SinonSpy;
            let resCookieSpy: SinonSpy;
            let result: SessionTokenResponse;
            let req: Request;
            let caughtError: any;

            before(async () => {
                const credentials: SessionRequest = {
                    email: 'valid@email.com',
                    password: 'validPass1',
                };

                const stubResponse: SessionTokens = null;

                req = {
                    res: {
                        cookie: () => {},
                    },
                };

                sessionServiceLoginStub = sinon
                    .stub(sessionService, 'loginWithPassword')
                    .resolves(stubResponse);

                resCookieSpy = sinon.spy(req.res, 'cookie');

                try {
                    result = await sessionController.login(req, credentials);
                } catch (error) {
                    caughtError = error;
                }
            });

            after(() => {
                sessionServiceLoginStub.restore();
                resCookieSpy.restore();
            });

            it('should call the session service', () => {
                expect(sessionServiceLoginStub).to.have.been.called;
            });

            it('should not a cookie to the response', () => {
                expect(resCookieSpy).to.not.have.been.called;
            });

            it('should throw an UnauthorizedException', () => {
                expect(caughtError instanceof UnauthorizedException).to.be.true;
            });

            it('should return a 401 status', () => {
                expect(caughtError.response.statusCode).to.be.equal(401);
            });

            it('should return a message of Invalid \'Credentials\'', () => {
                expect(caughtError.response.message).to.be.string('Invalid Credentials');
            });
        });
    });

    describe('refresh()', () => {
        let sessionServiceRefeshTokenStub: SinonStub;
        let result: SessionTokenResponse;

        before(async () => {

            sessionServiceRefeshTokenStub = sinon
                .stub(sessionService, 'refreshTokens')
                .resolves(mockSessionTokens);

            result = await sessionController.refresh(mockSession);
        });

        after(() => {
            sessionServiceRefeshTokenStub.restore();
        });

        it('should call the session service', () => {
            expect(sessionServiceRefeshTokenStub).to.have.been.called;
        });

        it('should return an access token in the body', () => {
            expect(result).to.contain.key('accessToken');
            expect(result.accessToken).to.be.a('string');
            expect(result.accessToken).to.be.string(mockSessionTokens.accessToken);
        });

        it('should return a refresh token in the body', () => {
            expect(result).to.contain.key('refreshToken');
            expect(result.refreshToken).to.be.a('string');
            expect(result.refreshToken).to.be.string(mockSessionTokens.refreshToken);
        });

        it('should not return the cookie token in the body', () => {
            expect(result).not.to.contain.key('cookieToken');
        });
    });
});
