import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import { Repository } from 'typeorm';

import { AuthGuard } from '../../../src/utils/auth/auth.guard';
import { mockMembers } from '../../routes/members/members.test-helpers';
import { InternalServerErrorException } from '@nestjs/common';

chai.use(sinonChai);

const expect = chai.expect;

class AuthService {
    getMember() {}
    verifyToken() {}
}

class Reflector {
    get() {}
}

const mockContext = {
    handler: 'handler',
};

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let authService: AuthService;
    let reflector: Reflector;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                AuthGuard,
                {
                    provide: 'AuthService',
                    useClass: AuthService,
                },
                {
                    provide: 'Reflector',
                    useClass: Reflector,
                },

            ],
        }).compile();

        reflector = module.get<Reflector>(Reflector);

        authService = module.get<AuthService>(AuthService);
        authGuard = module.get<AuthGuard>(AuthGuard);
    });

    describe('canActivate()', () => {
        let reflectorGetStub: sinonStub;
        let authServiceVerifyTokenStub: sinonStub;
        let authServiceGetMemberStub: sinonStub;
        let mockReq: any;
        let result: boolean;

        describe('with an invalid header or JWT', () => {

            describe('and no role', () => {
                before(async () => {
                    mockReq = {
                        headers: {},
                    };

                    reflectorGetStub = sinon.stub(reflector, 'get').returns(undefined);
                    authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(null);
                    authServiceGetMemberStub = sinon.stub(authService, 'getMember');

                    result = await authGuard.canActivate(mockReq, mockContext);
                });

                after(() => {
                    reflectorGetStub.restore();
                    authServiceVerifyTokenStub.restore();
                    authServiceGetMemberStub.restore();
                });

                it('should return true', () => {
                    expect(result).to.be.true;
                });

                it('should retrieve roles from reflector', () => {
                    expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                });

                it('should call the verifyToken method in the auth service', () => {
                    expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                });

                it('should not call the getMember method in the auth service', () => {
                    expect(authServiceGetMemberStub).to.have.not.been.called;
                });
            });

            describe('and a required role', () => {
                before(async () => {
                    mockReq = {
                        headers: {},
                    };

                    reflectorGetStub = sinon.stub(reflector, 'get').returns(['role1']);
                    authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(null);
                    authServiceGetMemberStub = sinon.stub(authService, 'getMember');

                    result = await authGuard.canActivate(mockReq, mockContext);
                });

                after(() => {
                    reflectorGetStub.restore();
                    authServiceVerifyTokenStub.restore();
                    authServiceGetMemberStub.restore();
                });

                it('should return false', () => {
                    expect(result).to.be.false;
                });

                it('should retrieve roles from reflector', () => {
                    expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                });

                it('should call the verifyToken method in the auth service', () => {
                    expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                });

                it('should not call the getMember method in the auth service', () => {
                    expect(authServiceGetMemberStub).to.have.not.been.called;
                });
            });
        });

        describe('with a valid auth header and JWT', () => {
            describe('where the user cannot be retrieved from the database', () => {

                let caughtError: any;

                before(async () => {
                    mockReq = {
                        headers: {
                            authorization: 'Bearer xxx.yyy.zzz',
                        },
                    };

                    reflectorGetStub = sinon.stub(reflector, 'get').returns(undefined);
                    authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                    authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(null);

                    try {
                        result = await authGuard.canActivate(mockReq, mockContext);
                    } catch (error) {
                        caughtError = error;
                    }
                });

                after(() => {
                    reflectorGetStub.restore();
                    authServiceVerifyTokenStub.restore();
                    authServiceGetMemberStub.restore();
                });

                it('should throw a BadRequestException', () => {
                    expect(caughtError instanceof InternalServerErrorException).to.be.true;
                });

                it('should retrieve roles from reflector', () => {
                    expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                });

                it('should call the verifyToken method in the auth service', () => {
                    expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                });

                it('should call the getMember method in the auth service', () => {
                    expect(authServiceGetMemberStub).to.have.been.called;
                });
            });

            describe('and no role', () => {
                before(async () => {
                    mockReq = {
                        headers: {},
                    };

                    reflectorGetStub = sinon.stub(reflector, 'get').returns(undefined);
                    authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                    authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(mockMembers[0]);

                    result = await authGuard.canActivate(mockReq, mockContext);
                });

                after(() => {
                    reflectorGetStub.restore();
                    authServiceVerifyTokenStub.restore();
                    authServiceGetMemberStub.restore();
                });

                it('should return true', () => {
                    expect(result).to.be.true;
                });

                it('should retrieve roles from reflector', () => {
                    expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                });

                it('should call the verifyToken method in the auth service', () => {
                    expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                });

                it('should call the getMember method in the auth service', () => {
                    expect(authServiceGetMemberStub).to.have.been.calledWith(mockMembers[0].userId);
                });
            });

            describe('and a required role', () => {
                describe('where a single role matches', () => {
                    before(async () => {
                        mockReq = {
                            headers: {},
                        };

                        reflectorGetStub = sinon.stub(reflector, 'get').returns(['member']);
                        authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                        authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(mockMembers[0]);

                        result = await authGuard.canActivate(mockReq, mockContext);
                    });

                    after(() => {
                        reflectorGetStub.restore();
                        authServiceVerifyTokenStub.restore();
                        authServiceGetMemberStub.restore();
                    });

                    it('should return true', () => {
                        expect(result).to.be.true;
                    });

                    it('should retrieve roles from reflector', () => {
                        expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                    });

                    it('should call the verifyToken method in the auth service', () => {
                        expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                    });

                    it('should call the getMember method in the auth service', () => {
                        expect(authServiceGetMemberStub).to.have.been.calledWith(mockMembers[0].userId);
                    });
                });

                describe('where a single role doesn\'t match', () => {
                    before(async () => {
                        mockReq = {
                            headers: {},
                        };

                        reflectorGetStub = sinon.stub(reflector, 'get').returns(['role1']);
                        authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                        authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(mockMembers[0]);

                        result = await authGuard.canActivate(mockReq, mockContext);
                    });

                    after(() => {
                        reflectorGetStub.restore();
                        authServiceVerifyTokenStub.restore();
                        authServiceGetMemberStub.restore();
                    });

                    it('should return false', () => {
                        expect(result).to.be.false;
                    });

                    it('should retrieve roles from reflector', () => {
                        expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                    });

                    it('should call the verifyToken method in the auth service', () => {
                        expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                    });

                    it('should call the getMember method in the auth service', () => {
                        expect(authServiceGetMemberStub).to.have.been.calledWith(mockMembers[0].userId);
                    });
                });

                describe('where multiple roles matche', () => {
                    before(async () => {
                        mockReq = {
                            headers: {},
                        };

                        reflectorGetStub = sinon.stub(reflector, 'get').returns(['member', 'role1', 'committee']);
                        authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                        authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(mockMembers[0]);

                        result = await authGuard.canActivate(mockReq, mockContext);
                    });

                    after(() => {
                        reflectorGetStub.restore();
                        authServiceVerifyTokenStub.restore();
                        authServiceGetMemberStub.restore();
                    });

                    it('should return true', () => {
                        expect(result).to.be.true;
                    });

                    it('should retrieve roles from reflector', () => {
                        expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                    });

                    it('should call the verifyToken method in the auth service', () => {
                        expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                    });

                    it('should call the getMember method in the auth service', () => {
                        expect(authServiceGetMemberStub).to.have.been.calledWith(mockMembers[0].userId);
                    });
                });

                describe('where multiple roles don\'t match', () => {
                    before(async () => {
                        mockReq = {
                            headers: {},
                        };

                        reflectorGetStub = sinon.stub(reflector, 'get').returns(['role1', 'role2', 'role3']);
                        authServiceVerifyTokenStub = sinon.stub(authService, 'verifyToken').resolves(mockMembers[0].userId);
                        authServiceGetMemberStub = sinon.stub(authService, 'getMember').resolves(mockMembers[0]);

                        result = await authGuard.canActivate(mockReq, mockContext);
                    });

                    after(() => {
                        reflectorGetStub.restore();
                        authServiceVerifyTokenStub.restore();
                        authServiceGetMemberStub.restore();
                    });

                    it('should return false', () => {
                        expect(result).to.be.false;
                    });

                    it('should retrieve roles from reflector', () => {
                        expect(reflectorGetStub).to.have.been.calledWith('roles', mockContext.handler);
                    });

                    it('should call the verifyToken method in the auth service', () => {
                        expect(authServiceVerifyTokenStub).to.have.been.calledWith(mockReq);
                    });

                    it('should call the getMember method in the auth service', () => {
                        expect(authServiceGetMemberStub).to.have.been.calledWith(mockMembers[0].userId);
                    });
                });
            });
        });
    });
});
