/* Nest Testing  */
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

/* Chai and addons */
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SinonSpy, SinonStub } from 'sinon';

/* Nest */
import { BadRequestException, Request } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/* API dependancies */
import { SessionController } from '../session.controller';
import { SessionRequest } from '../session.models';
import { ISessionTokenResponse, ISessionTokens } from '../session.interfaces';

/* API Test dependancies */
import { mockSession, mockSessionTokens } from './session.test-helpers';
import { SessionGuard } from '../session.guard';

chai.use(sinonChai);

const expect = chai.expect;

class SessionService  {
    loadSession() {}
    removeSession() {}
}

class Reflector  {
    get() {}
}

describe('SessionGuard', () => {
    let sessionService: SessionService;
    let sessionGuard: SessionGuard;
    let reflector: Reflector;

    before(async () => {
        const module: TestingModule = await Test.createTestingModule({
            components: [
                SessionGuard,
                {
                    provide: 'SessionService',
                    useClass: SessionService,
                },
                {
                    provide: 'Reflector',
                    useClass: Reflector,
                },
            ],
        }).compile();

        sessionService = module.get<SessionService>(SessionService);
        sessionGuard = module.get<SessionGuard>(SessionGuard);

        reflector = module.get<Reflector>(Reflector);
    });

    describe('canActivate()', () => {

        describe('for a valid session with no tokenType', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: mockSession,
                        token: {
                            type: 'access',
                            verified: true,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession')

                reflectorGetStub = sinon.stub(reflector, 'get').returns(undefined);

                mockRequest = {
                    headers: {
                        authorization: `Bearer aaa.bbb.ccc}`,
                    },
                    cookies: {
                        'CSRF-TOKEN': mockSession.cookie,
                    },
                };

                result = await sessionGuard.canActivate(mockRequest, { handler: null });
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should return true', () => {
                expect(result).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.not.have.been.called;
            });
        });

        describe('for a valid session with correct tokenType', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: mockSession,
                        token: {
                            type: 'access',
                            verified: true,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession')

                reflectorGetStub = sinon.stub(reflector, 'get').returns('access');

                mockRequest = {
                    headers: {
                        authorization: `Bearer aaa.bbb.ccc}`,
                    },
                    cookies: {
                        'CSRF-TOKEN': mockSession.cookie,
                    },
                };

                result = await sessionGuard.canActivate(mockRequest, { handler: null });
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should return true', () => {
                expect(result).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.not.have.been.called;
            });
        });

        describe('for a valid session with incorrect token type', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;
            let caughtError: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: mockSession,
                        token: {
                            type: 'refresh',
                            verified: true,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession')

                reflectorGetStub = sinon.stub(reflector, 'get').returns('access');

                mockRequest = {
                    headers: {
                        authorization: `Bearer aaa.bbb.ccc}`,
                    },
                    cookies: {
                        'CSRF-TOKEN': mockSession.cookie,
                    },
                };

                try {
                    result = await sessionGuard.canActivate(mockRequest, { handler: null });
                } catch (error) {
                    caughtError = error;
                }
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should throw an BadRequestException', () => {
                expect(caughtError instanceof BadRequestException).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.not.have.been.called;
            });
        });

        describe('for an invalid session with no tokenType', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;
            let caughtError: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: null,
                        token: {
                            type: 'invalid',
                            verified: false,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession');

                reflectorGetStub = sinon.stub(reflector, 'get').returns(undefined);

                mockRequest = {
                    headers: {},
                    cookies: {},
                };

                try {
                    result = await sessionGuard.canActivate(mockRequest, { handler: null });
                } catch (error) {
                    caughtError = error;
                }
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should return true', () => {
                expect(result).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.not.have.been.called;
            });
        });

        describe('for an invalid session with tokenType', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;
            let caughtError: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: null,
                        token: {
                            type: 'invalid',
                            verified: false,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession');

                reflectorGetStub = sinon.stub(reflector, 'get').returns('access');

                mockRequest = {
                    headers: {},
                    cookies: {},
                };

                try {
                    result = await sessionGuard.canActivate(mockRequest, { handler: null });
                } catch (error) {
                    caughtError = error;
                }
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should throw an UnauthorizedException', () => {
                expect(caughtError instanceof UnauthorizedException).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.not.have.been.called;
            });
        });

        describe('for an valid session with bad tokens', () => {

            let sessionServiceLoadSessionStub: SinonStub;
            let sessionServiceRemoveSessionStub: SinonStub;
            let reflectorGetStub: SinonStub;

            let mockRequest: any;
            let result: any;
            let caughtError: any;

            before(async () => {
                sessionServiceLoadSessionStub = sinon
                    .stub(sessionService, 'loadSession')
                    .resolves({
                        session: mockSession,
                        token: {
                            type: 'access',
                            verified: false,
                        },
                    });

                sessionServiceRemoveSessionStub = sinon.stub(sessionService, 'removeSession');

                reflectorGetStub = sinon.stub(reflector, 'get').returns('access');

                mockRequest = {
                    headers: {},
                    cookies: {},
                };

                try {
                    result = await sessionGuard.canActivate(mockRequest, { handler: null });
                } catch (error) {
                    caughtError = error;
                }
            });

            after(() => {
                sessionServiceLoadSessionStub.restore();
                sessionServiceRemoveSessionStub.restore();
                reflectorGetStub.restore();
            });

            it('should throw an UnauthorizedException', () => {
                expect(caughtError instanceof UnauthorizedException).to.be.true;
            });

            it('should call the sessionService loadSession method', () => {
                expect(sessionServiceLoadSessionStub).to.have.been.calledWith(mockRequest);
            });

            it('should call the relector to get tokenType metadata', () => {
                expect(reflectorGetStub).to.have.been.called;
                expect(reflectorGetStub.getCall(0).args[0]).to.be.a.string('tokenType');
            });

            it('should not call the sessionService removeSession method', () => {
                expect(sessionServiceRemoveSessionStub).to.have.been.called;
            });
        });
    });
});
