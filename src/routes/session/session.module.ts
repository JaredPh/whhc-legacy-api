import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController } from './session.controller';
import { SessionService } from './session.service';

import { MembersModule } from '../members/members.module';
import { EMember } from '../members/members.entity';
import { ESession } from './session.entity';
import { SessionGuard } from './session.guard';

@Module({
    controllers: [
        SessionController,
    ],
    imports: [
        MembersModule,
        TypeOrmModule.forFeature([EMember, ESession]),
    ],
    components: [
        SessionService,
        SessionGuard,
    ],
})
export class SessionModule {}
