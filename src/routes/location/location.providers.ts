import { Connection } from 'typeorm';

import { Location } from './location.entity';

// noinspection JSUnusedGlobalSymbols
export const locationProviders = [
    {
        provide: 'LocationRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Location),
        inject: ['DbConnectionToken'],
    },
];