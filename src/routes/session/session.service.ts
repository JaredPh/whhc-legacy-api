import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { Member } from '../members/members.entity';
import { Session } from './session.entity';
import { SessionTokens } from './session.interfaces';

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
        return moment().add(process.env.JWT_REFRESH_HOURS, 'hours').toDate();
    }

    private static async generateSessionTokens(session: Session): Promise<SessionTokens> {
        return {
            accessToken: await SessionService.generateToken('access', session),
            refreshToken: await SessionService.generateToken('refresh', session),
            cookieToken: session.cookie,
        };
    }

    public static async generateToken(type: 'access' | 'refresh', session: Session): Promise<string> {
        let exp: number;

        switch (type) {
            case 'access':
                exp = moment().add(process.env.JWT_ACCESS_HOURS, 'hours').unix();
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

        return await jwt.sign(payload, process.env.JWT_SECRET, options);
    }

    public static getTokenFromHeaders(headers: { [key: string]: string }): string {
        const authHeader = headers.authorization;

        return (/^Bearer [^ ]+$/.test(authHeader))
            ? authHeader.split(' ')[1]
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

        if (!session) return null;

        session.access = await SessionService.generateHash(sessionId);
        session.refresh = await SessionService.generateHash(sessionId);
        session.expiry = SessionService.generateRefreshExpiry();

        session = await this.sessionRepository.save(session);

        return await SessionService.generateSessionTokens(session);
    }

    public removeSession(sessionId: string): void {
        this.sessionRepository.removeById(sessionId);
    }

    public async validateSession(id: string, type: string, token: string, cookie: string) {
        const session: Session = await this.sessionRepository.findOneById(id);

        const response = {
            hasValidId: false,
            hasValidToken: false,
            hasValidCookie: false,
            isValidSession: false,
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

    public static async verifyAndDecodeToken(token: string) { // todo: add type

        const options = {
            issuer: process.env.JWT_ISSUER,
        };

        try {
            jwt.verify(token, process.env.JWT_SECRET, options);
        } catch (e) {
            return null;
        }

        const decoded = await jwt.decode(token, { complete: true });

        return {
            sessionId: decoded.header.kid,
            token: decoded.payload.jti,
            type: decoded.payload.scope,
        };
    }
}
