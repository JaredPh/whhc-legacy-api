import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { EMember } from './members.entity';

@Module({
    controllers: [
        MembersController,
    ],
    imports: [
        TypeOrmModule.forFeature([EMember]),
    ],
    components: [
        MembersService,
    ],
})
export class MembersModule {}
