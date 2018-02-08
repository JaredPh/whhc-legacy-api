import { createConnection } from 'typeorm';

// noinspection JSUnusedGlobalSymbols
export const databaseProviders = [
    {
        provide: 'DbConnectionToken',
        useFactory: async () => await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [
                __dirname + '/../../routes/**/*.entity{.ts,.js}',
            ],
            synchronize: true,
        }),
    },
];