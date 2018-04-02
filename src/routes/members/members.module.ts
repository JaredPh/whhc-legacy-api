import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './members.entity';

@Module({
    controllers: [
        MembersController,
    ],
    imports: [
        TypeOrmModule.forFeature([Member]),
    ],
    components: [
        MembersService,
    ],
    exports: [
        Member,
    ],
})
export class MembersModule {}
