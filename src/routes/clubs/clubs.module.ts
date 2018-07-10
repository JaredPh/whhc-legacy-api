import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Club } from './clubs.entity';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

@Module({
    controllers: [
        ClubsController,
    ],
    components: [
        ClubsService,
    ],
    imports: [
        TypeOrmModule.forFeature([Club]),
    ],
})
export class ClubsModule {}
