import { Connection } from 'typeorm';

import { Team } from './team.entity';

// noinspection JSUnusedGlobalSymbols
export const teamProviders = [
    {
        provide: 'TeamRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Team),
        inject: ['DbConnectionToken'],
    },
];