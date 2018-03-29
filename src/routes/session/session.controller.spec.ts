/* Nest Testing  */
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

/* Chai and addons */
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SinonSpy, SinonStub } from 'sinon';

/* Nest */
import { Request } from '@nestjs/common';

/* External dependancies */

/* API dependancies */
import { SessionController } from './session.controller';
import { LoginRequest } from './models/login-request.model';
import { LoginResponse, LoginTokens } from './models/login.interfaces';

chai.use(sinonChai);

const expect = chai.expect;

class SessionService {
    loginWithPassword() {}
}

describe('SessionController', () => {
    let sessionService: SessionService;
    let sessionController: SessionController;

    let sessionServiceMock: SinonSpy;
    let requestServiceMock: SinonStub;

    let req: Request;
    let result: LoginResponse;

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

        req = {
           res: {
               cookie: () => {},
           },
        };

        requestServiceMock = sinon.stub(req.res, 'cookie').returns(() => {});
    });

    describe('login()', () => {

        before(async () => {
            const credentials: LoginRequest = {
                email: 'valid@email.com',
                password: 'validPass1',
            };

            const spyResponse: LoginTokens = {
                accessToken: 'x',
                refreshToken: 'y',
                cookieToken: 'z',
            };

            sessionServiceMock = sinon
                .stub(sessionService, 'loginWithPassword')
                .resolves(spyResponse);

            result = await sessionController.login(req, credentials);
        });

        it('should call the session service', () => {
            expect(sessionServiceMock).to.have.been.called;
        });

        it('should add a cookie to the response', () => {
            expect(requestServiceMock).to.have.been.calledWith('CSRF-TOKEN', 'z', { httpOnly: true, secure: false });
        });

        it('should return an access token in the body', () => {
            expect(result).to.contain.key('accessToken');
            expect(result.accessToken).to.be.a('string');
            expect(result.accessToken).to.be.string('x');
        });

        it('should return a refresh token in the body', () => {
            expect(result).to.contain.key('refreshToken');
            expect(result.refreshToken).to.be.a('string');
            expect(result.refreshToken).to.be.string('y');
        });

        it('should not return the cookie token in the body', () => {
            expect(result).not.to.contain.key('cookieToken');
        });
    });
});