import { Component } from '@nestjs/common';

import * as moment from 'moment';
import * as CognitoExpress from 'cognito-express';

import { Member } from '../../routes/members/members.entity';
import { MembersService } from '../../routes/members/members.service';
import { CognitoEvent, CognitoParams } from './auth.interfaces';
import { EncryptionService } from '../encryption/encryption.service';

@Component()
export class AuthService {

    private cognitoParams: CognitoParams = {
        cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
        region: process.env.COGNITO_REGION,
        tokenUse: 'id',
        tokenExpiration: process.env.COGNITO_TOKEN_EXP,
    };

    public cognitoExpress: CognitoExpress; // public for testing

    constructor(
        private readonly membersService: MembersService,
    ) {
        this.cognitoExpress = new CognitoExpress(this.cognitoParams);
    }

    public verifyToken(req: any): Promise<string> {
        return new Promise((resolve) => {
            let header: string;

            try {
                header = req.headers.authorization;
            } catch {
                resolve(null);
            }

            if (/Bearer [^ ]+/.test(header)) {
                const token = header.split(' ')[1];

                this.cognitoExpress.validate(token, (error, response) => {

                    if (error) {
                        resolve(null);
                    } else {
                        resolve(response['cognito:username']);
                    }

                });
            } else {
                resolve(null);
            }
        });
    }

    public verifyEncryptedKey(key: string, eventType: string): boolean {
        let event: CognitoEvent;

        try {
            const decryptedKey = EncryptionService.decrypt(key);
            event = JSON.parse(decryptedKey);
        } catch {
            return false;
        }

        const now: number = +moment();
        const tolerance: number = 60000; // 1 min -  1000 * 60;

        const timeDiff: number = Math.abs(now - +moment(event.time));

        if (event.type === eventType && event.cognitoPoolId === this.cognitoParams.cognitoUserPoolId && timeDiff < tolerance) {
            return true;
        } else {
            return false;
        }
    }

    public async getMember(userId: string): Promise<Member> {
        return await this.membersService.findOneByUserId(userId);
    }
}
