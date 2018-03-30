import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { Member } from '../members/models/members.entity';
import { Session } from './session.entity';
import { SessionTokens } from './session.interfaces';

// todo: make env var
const secret = 'xxx';

@Component()
export class SessionService {

    /**
     * @todo Istanbul - remove any when branch bug is resolved
     * @see https://github.com/istanbuljs/istanbuljs/issues/70
     */
    constructor(
        @InjectRepository(Member) private readonly membersRepository: Repository<Member> | any,
        @InjectRepository(Session) private readonly sessionRepository: Repository<Session> | any,
    ) {}

    private static async generateHash(string: string): Promise<string> {
        return (await bcrypt.hash(string, 8)).substr(7);
    }

    private static generateRefreshExpiry(): Date {
        return moment().add(7, 'days').toDate();
    }

    private static generateSessionTokens(session: Session): SessionTokens {
        return {
            accessToken: SessionService.generateToken('access', session),
            refreshToken: SessionService.generateToken('refresh', session),
            cookieToken: session.cookie,
        };
    }

    private static generateToken(type: 'access' | 'refresh', session: Session): string {
        let exp: number;

        switch (type) {
            case 'access':
                exp = moment().add(1, 'hour').unix();
                break;
            case 'refresh':
                exp = Math.floor(session.expiry.getTime() / 1000);
                break;
        }

        const payload = { exp };

        const options = {
            issuer: 'WHHC',
            jwtid: (type === 'access') ? session.access : session.refresh,
            keyid: session.id,
            subject: type,
            algorithm: 'HS256',
        };

        return jwt.sign(payload, secret, options);
    }

    public static getTokenFromHeader(header: string): string {
        return (/^Bearer [^ ]+$/.test(header))
            ? header.split(' ')[1]
            : null;
    }

    public async loginWithPassword(email: string, password: string): Promise<SessionTokens> {

        let credentialsAreValid: boolean;

        const member: Member = await this.membersRepository.findOne({ email });

        credentialsAreValid = (member)
            ? await bcrypt.compare(password, member.password)
            : false;

        if (!credentialsAreValid) return null;

        const sessionId: string = uuid();

        const session: Session = await this.sessionRepository.save({
            id: sessionId,
            member: member.id,
            cookie: await SessionService.generateHash(sessionId),
            access: await SessionService.generateHash(sessionId),
            refresh: await SessionService.generateHash(sessionId),
            expiry: SessionService.generateRefreshExpiry(),
        });

        return SessionService.generateSessionTokens(session);
    }

    public async refreshTokens(sessionId: string) {
        let session: Session = await this.sessionRepository.findOneById(sessionId);

        session.access = await SessionService.generateHash(sessionId);
        session.refresh = await SessionService.generateHash(sessionId);
        session.expiry = SessionService.generateRefreshExpiry();

        session = await this.sessionRepository.save(session);

        return SessionService.generateSessionTokens(session);
    }

    public async revokeSession(sessionId: string) {
        return await this.sessionRepository.removeById(sessionId);
    }

    public async validateSession(id: string, type: string, token: string, cookie: string) {
        const session: Session = await this.sessionRepository.findOneById(id);

        const response = {
            hasValidId: false,
            hasValidToken: false,
            hasValidCookie: false,
            isValidSession: true,
            memberId: null,
        };

        if (session) {
            response.hasValidId = true;
            response.hasValidToken = token === session[type];
            response.hasValidCookie = cookie === session.cookie;

            response.isValidSession = response.hasValidId && response.hasValidToken && response.hasValidCookie;

            response.memberId = session.member;
        }

        return response;
    }

    public static verifyAndDecodeToken(token: string) { // todo: add type

        const options = {
            issuer: 'WHHC',
            algorithms: 'HS256',
        };

        try {
            jwt.verify(token, secret, options);
        } catch (e) {
            return null;
        }

        const decoded = jwt.decode(token, { complete: true });

        return {
            sessionId: decoded.header.kid,
            token: decoded.payload.jti,
            type: decoded.payload.sub,
        };
    }
}
