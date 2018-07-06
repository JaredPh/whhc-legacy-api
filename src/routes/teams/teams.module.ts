import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './teams.entity';

@Module({
    controllers: [
    ],
    components: [
    ],
    imports: [
        TypeOrmModule.forFeature([Team]),
    ],
})
export class TeamsModule {}
