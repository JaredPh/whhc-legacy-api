import { Connection } from 'typeorm';

import { Game } from './game.entity';

// noinspection JSUnusedGlobalSymbols
export const gameProviders = [
    {
        provide: 'GameRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Game),
        inject: ['DbConnectionToken'],
    },
];
