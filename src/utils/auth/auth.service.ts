import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as CognitoExpress from 'cognito-express';

import { TokenUser } from './auth.models';
import { Member } from '../../routes/members/members.entity';

@Component()
export class AuthService {

    private cognitoExpress: CognitoExpress;

    constructor(
        @InjectRepository(Member) private readonly membersRepository: Repository<Member>,
    ) {
        this.cognitoExpress = new CognitoExpress({
            region: 'eu-west-1',
            cognitoUserPoolId: 'eu-west-1_E1Ww58O9j',
            tokenUse: 'id',
            tokenExpiration: 3600000, // 1 hour
        });
    }

    public verifyToken(header: string): Promise<TokenUser> {
        return new Promise((resolve) => {
            if (!/Bearer [^ ]+/.test(header)) resolve(null);

            const token = header.split(' ')[1];

            this.cognitoExpress.validate(token, (error, response) => {

                if (error) {
                    resolve(null);
                } else {
                    resolve(response['cognito:username']);
                }

            });
        });
    }

    public async getMember(userId: string): Promise<Member> {
        return await this.membersRepository.findOne({ userId });
    }
}
