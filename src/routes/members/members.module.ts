import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './members.entity';

@Module({
    controllers: [
        MembersController,
    ],
    components: [
        MembersService,
    ],
    imports: [
        TypeOrmModule.forFeature([Member]),
    ],
    exports: [
        MembersService,
    ],
})
export class MembersModule {}
