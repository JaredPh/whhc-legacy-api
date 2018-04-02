import { Session } from '../session.entity';

import * as moment from 'moment';

export const mockSession: Session = {
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
