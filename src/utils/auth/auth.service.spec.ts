import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';
import { mockMembers } from '../../routes/members/members.test-helpers';
import { AuthService } from './auth.service';
import { mockRequests, mockUserName } from '../../../test-helpers/auth.test-helpers';

import * as dotEnv from 'dotenv';

import { EncryptionService } from '../encryption/encryption.service';
import { CognitoEvent } from './auth.interfaces';
import * as moment from 'moment';

dotEnv.config();

chai.use(sinonChai);

const expect = chai.expect;

class MembersService {
    findOneByUserId() {}
}

describe('AuthService', () => {
    let membersService: MembersService;
    let authService: AuthService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                AuthService,
                {
                    provide: 'MembersService',
                    useClass: MembersService,
                },
            ],
        }).compile();

        membersService = module.get<MembersService>(MembersService);
        authService = module.get<AuthService>(AuthService);
    });

    describe('verifyToken()', () => {
        let authServiceCognitoExpressSpy: SinonStub;
        let result: string;

        describe('with a valid header and JWT', () => {
            before(async () => {
                authServiceCognitoExpressSpy = sinon.stub(authService.cognitoExpress, 'validate')
                    .callsArgWith(1, null, { 'username': mockUserName });

                result = await authService.verifyToken(mockRequests.valid);
            });

            after(() => {
                authServiceCognitoExpressSpy.restore();
            });

            it('should return the userId from the token', () => {
                expect(result).to.be.a.string(mockUserName);
            });

            it('should call cognito-express to validate the token', () => {
                expect(authServiceCognitoExpressSpy).to.have.been.called;
            });
        });

        describe('with a valid header and invalid JWT', () => {
            before(async () => {
                authServiceCognitoExpressSpy = sinon.stub(authService.cognitoExpress, 'validate')
                    .callsArgWith(1, {}, null);

                result = await authService.verifyToken(mockRequests.invalid);
            });

            after(() => {
                authServiceCognitoExpressSpy.restore();
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });

            it('should call cognito-express to validate the token', () => {
                expect(authServiceCognitoExpressSpy).to.have.been.called;
            });
        });

        describe('with an invalid header', () => {
            before(async () => {
                authServiceCognitoExpressSpy = sinon.stub(authService.cognitoExpress, 'validate');

                result = await authService.verifyToken(mockRequests.incorrect);
            });

            after(() => {
                authServiceCognitoExpressSpy.restore();
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });

            it('should not call cognito-express to validate the token', () => {
                expect(authServiceCognitoExpressSpy).to.have.not.been.called;
            });
        });

        describe('with no header', () => {
            before(async () => {
                authServiceCognitoExpressSpy = sinon.stub(authService.cognitoExpress, 'validate');

                result = await authService.verifyToken(mockRequests.missing);
            });

            after(() => {
                authServiceCognitoExpressSpy.restore();
            });

            it('should return null', () => {
                expect(result).to.be.null;
            });

            it('should not call cognito-express to validate the token', () => {
                expect(authServiceCognitoExpressSpy).to.have.not.been.called;
            });
        });
    });

    describe('verifyEncryptedKey()', () => {

        it('should return true with a valid key', () => {
            const payload: CognitoEvent = {
                type: 'mockEvent',
                cognitoPoolId: process.env.COGNITO_USER_POOL_ID,
                time: +moment(),
            };

            const keyString = JSON.stringify(payload);
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.true;
        });

        it('should return false when the key decrypts a payload where the event time is too early', () => {
            const payload: CognitoEvent = {
                type: 'mockEvent',
                cognitoPoolId: process.env.COGNITO_USER_POOL_ID,
                time: +moment() - 61 * 1000,
            };

            const keyString = JSON.stringify(payload);
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });

        it('should return false when the key decrypts a payload where the event time is too late', () => {
            const payload: CognitoEvent = {
                type: 'mockEvent',
                cognitoPoolId: process.env.COGNITO_USER_POOL_ID,
                time: +moment() + 61 * 1000,
            };

            const keyString = JSON.stringify(payload);
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });

        it('should return false when the key decrypts a payload where the poolId doesn\'t match', () => {
            const payload: CognitoEvent = {
                type: 'mockEvent',
                cognitoPoolId: 'wrongPoolId',
                time: +moment(),
            };

            const keyString = JSON.stringify(payload);
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });

        it('should return false when the key decrypts a payload where the event doesn\'t match', () => {
            const payload: CognitoEvent = {
                type: 'differentEvent',
                cognitoPoolId: process.env.COGNITO_USER_POOL_ID,
                time: +moment(),
            };

            const keyString = JSON.stringify(payload);
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });

        it('should return false when the key decrypts an invalid json string', () => {
            const keyString = '{ notValidJSON }';
            const key = EncryptionService.encrypt(keyString);

            const eventType = 'mockEvent';

            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });

        it('should return false when the encryption is invalid ', () => {
            const key = 'invalid:keyString';
            const eventType = 'mockEvent';
            const result = authService.verifyEncryptedKey(key, eventType);

            expect(result).to.be.false;
        });
    });

    describe('getMember()', () => {
        let membersServiceFindOneByUserIdStub: SinonStub;
        let result: Member;

        before(async () => {
            membersServiceFindOneByUserIdStub = sinon.stub(membersService, 'findOneByUserId')
                .resolves(mockMembers[0]);

            result = await authService.getMember(mockMembers[0].userId);
        });

        after(() => {
            membersServiceFindOneByUserIdStub.restore();
        });

        it('should return member from the repository unaltered ', () => {
            expect(result).to.deep.equal(mockMembers[0]);
        });

        it('should call the findOneByUserId method from the membersService', () => {
            expect(membersServiceFindOneByUserIdStub).to.have.been.calledWith(mockMembers[0].userId);
        });
    });
});
