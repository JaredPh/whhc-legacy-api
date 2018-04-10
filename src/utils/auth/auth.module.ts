import { Module } from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '../../routes/members/members.entity';
import { MembersModule } from '../../routes/members/members.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member]),
        MembersModule
    ],
    components: [
        AuthGuard,
        AuthService,
    ],
})
export class AuthModule {}
