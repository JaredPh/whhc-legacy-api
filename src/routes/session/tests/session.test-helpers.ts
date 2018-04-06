import { ESession } from '../session.entity';

import * as moment from 'moment';
import { ISessionTokenResponse, ISessionTokens } from '../session.interfaces';

export const mockSession: ESession = {
    id: '01234567-89ab-def0-1234-56789abcdef0',
    member: 123,
    cookie: 'dTl.OjcIOzUQtgyfCIC6YuRbB3hXFvO/6ZxfZsUhj5Mde/fmWcAX.',
    access: 'DdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456',
    refresh: 'GgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789AaB',
    expiry: moment().add(7, 'days').toDate(),
};

export const mockSessionTokens = {
    accessToken:  'aaaa.bbbbb.cccc',
    refreshToken: 'dddd.eeeee.ffff',
    cookieToken: mockSession.cookie,
};

export const mockJwtIssuer = 'mockIssuer';
export const mockJwtSecret = 'mockSecret';

export const mockJwtTokens: ISessionTokenResponse = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxMjM0NTY3LTg5YWItZGVmMC0xMjM0LTU2Nzg5YWJjZGVmMCJ9.eyJleHAiOjk1MjI5MjMyMTgsInNjb3BlIjoiYWNjZXNzIiwiaWF0IjoxNTIyOTE5NjE4LCJpc3MiOiJtb2NrSXNzdWVyIiwianRpIjoiRGRFZUZmR2dIaElpSmpLa0xsTW1Obk9vUHBRcVJyU3NUdFV1VnZXd1h4WXlaejAxMjM0NTYifQ.ajRCRKfu5Nv0Fs0U7mF8jz77i746tCMbrQKrKKaawMg',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxMjM0NTY3LTg5YWItZGVmMC0xMjM0LTU2Nzg5YWJjZGVmMCJ9.eyJleHAiOjk1MjI5MjMyMTgsInNjb3BlIjoicmVmcmVzaCIsImlhdCI6MTUyMjkxOTYxOCwiaXNzIjoibW9ja0lzc3VlciIsImp0aSI6IkdnSGhJaUpqS2tMbE1tTm5Pb1BwUXFSclNzVHRVdVZ2V3dYeFl5WnowMTIzNDU2Nzg5QWFCIn0.HxzblniOAAdUqrGZw9M5iQhLrO0u6fN9EChveTiWO3E',
};