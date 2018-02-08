import { Connection } from 'typeorm';

import { Club } from './club.entity';

// noinspection JSUnusedGlobalSymbols
export const clubProviders = [
    {
        provide: 'ClubRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Club),
        inject: ['DbConnectionToken'],
    },
];