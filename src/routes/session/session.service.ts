import { Component, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { Member } from '../members/models/members.entity';
import { Session } from './models/session.entity';
import { LoginResponse } from './models/login-response.interface';

@Component()
export class SessionService {

    constructor(
        @InjectRepository(Member)
        private readonly membersRepository: Repository<Member>,

        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    public async loginWithPassword(email: string, password: string): Promise<{ response: LoginResponse, cookie: string}> {
        let credentialsAreValid: boolean;

        const member: Member = await this.membersRepository.findOne({ email });

        credentialsAreValid = (member)
            ? await bcrypt.compare(password, member.password)
            : false;

        if (!credentialsAreValid) throw new UnauthorizedException('Invalid Credentials');

        const id: string = uuid();

        const session: Session = await this.sessionRepository.save({
            id,
            member: member.id,
            cookie: await SessionService.generateHash(id),
            access: await SessionService.generateHash(id),
            refresh: await SessionService.generateHash(id),
            accessExpiry: moment().add(1, 'hours').toDate(),
            refreshExpiry: moment().add(7, 'days').toDate(),
        });

        return {
            response: {
                accessToken: SessionService.generateToken('access', session),
                refreshToken: SessionService.generateToken('refresh', session),
            },
            cookie: session.cookie,
        };
    }

    private static async generateHash(string: string): Promise<string> {
        return (await bcrypt.hash(string, 8)).substr(7);
    }

    private static generateToken(type: 'access' | 'refresh', session: Session): string {
        const secret = 'xxx';

        const expiry =  (type === 'access')
            ? session.accessExpiry
            : session.refreshExpiry;

        const payload = {
            exp: Math.floor(expiry.getTime() / 1000),
        };

        const options = {
            issuer: 'WHHC',
            jwtid: (type === 'access') ? session.access : session.refresh,
            keyid: session.id,
            subject: type,
        };

        return jwt.sign(payload, secret, options);
    }
}