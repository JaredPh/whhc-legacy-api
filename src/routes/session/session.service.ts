import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { ESession } from './session.entity';
import { ISessionResult, ISessionTokenResponse, ISessionTokens } from './session.interfaces';
import { EMember } from '../members/members.entity';

@Component()
export class SessionService {

    private readonly ISSUER: string = process.env.JWT_ISSUER;
    private readonly SECRET: string = process.env.JWT_SECRET;
    private readonly ACCESS_HOURS: number = +process.env.JWT_ACCESS_HOURS;
    private readonly REFRESH_HOURS: number = +process.env.JWT_REFRESH_HOURS;
    private readonly HASH_ROUNDS: number = 8;

    constructor(
        @InjectRepository(ESession) private readonly sessionRepository: Repository<ESession>,
        @InjectRepository(EMember) private readonly membersRepository: Repository<EMember>,
    ) {}

    public async loadSession(req: any): Promise<ISessionResult> {

        let verified: boolean;
        let session: ESession = null;
        let tokenType: string = null;

        const authHeader: string = req.headers.authorization;

        const token: string = (authHeader && /^Bearer [^ ]+$/.test(authHeader))
            ? authHeader.split(' ')[1]
            : null;

        if (token) {
            const options = { issuer: this.ISSUER };

            try {
                jwt.verify(token, this.SECRET, options);
                verified = true;
            } catch (err) {
                verified = false;
            }

            const decoded = await jwt.decode(token, { complete: true });

            if (decoded) {

                const cookieToken = req.cookies['CSRF-TOKEN'];

                const sessionId: string = decoded.header.kid;
                const authToken: string = decoded.payload.jti;

                tokenType = decoded.payload.scope;

                session = await this.getSessionById(sessionId);

                if (session && verified) {
                    verified = authToken === session[tokenType]
                        && cookieToken === session.cookie;
                }
            }
        } else {
            tokenType = 'invalid';
        }

        return {
            session,
            token: {
                verified,
                type: tokenType,
            },
        };
    }

    public async loginWithPassword(email: string, password: string): Promise<ISessionTokens> {

        let credentialsAreValid: boolean;

        const member: EMember = await this.membersRepository.findOne({ email });

        credentialsAreValid = (member)
            ? await bcrypt.compare(password, member.password)
            : false;

        if (!credentialsAreValid) return null;

        const sessionId: string = uuid();

        const session: ESession = await this.sessionRepository.save({
            id: sessionId,
            member: member.id,
            cookie: await this.generateHash(sessionId),
            access: await this.generateHash(sessionId),
            refresh: await this.generateHash(sessionId),
            expiry: this.generateRefreshExpiry(),
        });

        return this.generateSessionTokens(session);
    }

    public async refreshTokens(session: ESession): Promise<ISessionTokenResponse> {
        session.access = await this.generateHash(session.id);
        session.refresh = await this.generateHash(session.id);
        session.expiry = this.generateRefreshExpiry();

        session = await this.sessionRepository.save(session);

        return await this.generateSessionTokens(session);
    }

    public async removeSession(sessionId: string): Promise<void> {
        return await this.sessionRepository.removeById(sessionId);
    }

    private async generateHash(string: string): Promise<string> {
        return (await bcrypt.hash(string, this.HASH_ROUNDS)).substr(7);
    }

    private generateRefreshExpiry(): Date {
        return moment().add(this.REFRESH_HOURS, 'hours').toDate();
    }

    private async generateSessionTokens(session: ESession): Promise<ISessionTokens> {
        return {
            accessToken: await this.generateToken('access', session),
            refreshToken: await this.generateToken('refresh', session),
            cookieToken: session.cookie,
        };
    }

    private async generateToken(type: 'access' | 'refresh', session: ESession): Promise<string> {
        let exp: number;

        switch (type) {
            case 'access':
                exp = moment().add(this.ACCESS_HOURS, 'hours').unix();
                break;
            case 'refresh':
                exp = Math.floor(session.expiry.getTime() / 1000);
                break;
        }

        const payload = { exp, scope: type };

        const options = {
            issuer: process.env.JWT_ISSUER,
            jwtid: (type === 'access') ? session.access : session.refresh,
            keyid: session.id,
        };

        return await jwt.sign(payload, this.SECRET, options);
    }

    private async getSessionById(id: string): Promise<ESession> {
        return await this.sessionRepository.findOneById(id);
    }
}
