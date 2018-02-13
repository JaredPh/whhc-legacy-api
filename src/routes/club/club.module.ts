import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './club.entity';

@Module({
    controllers: [
        ClubController,
    ],
    imports: [
        TypeOrmModule.forFeature([Club]),
    ],
    components: [
        ClubService,
    ],
})
export class ClubModule {}
