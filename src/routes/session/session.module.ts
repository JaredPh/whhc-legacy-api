import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController } from './session.controller';
import { SessionService } from './session.service';

import { MembersModule } from '../members/members.module';
import { Member } from '../members/members.entity';
import { Session } from './session.entity';

@Module({
    controllers: [
        SessionController,
    ],
    imports: [
        MembersModule,
        TypeOrmModule.forFeature([Member, Session]),
    ],
    components: [
        SessionService,
    ],
})
export class SessionModule {}
