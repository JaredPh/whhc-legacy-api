import { Component } from '@nestjs/common';

import * as CognitoExpress from 'cognito-express';

import { Member } from '../../routes/members/members.entity';
import { MembersService } from '../../routes/members/members.service';

@Component()
export class AuthService {

    public cognitoExpress: CognitoExpress;

    constructor(
        private readonly membersService: MembersService,
    ) {
        this.cognitoExpress = new CognitoExpress({
            region: 'eu-west-1',
            cognitoUserPoolId: 'eu-west-1_E1Ww58O9j',
            tokenUse: 'id',
            tokenExpiration: 3600000, // 1 hour
        });
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

    public async getMember(userId: string): Promise<Member> {
        return await this.membersService.findOneByUserId(userId);
    }
}
