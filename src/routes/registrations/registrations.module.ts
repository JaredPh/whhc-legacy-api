import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Registration } from './registrations.entity';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { GocardlessModule } from '../../clients/gocardless/gocardless.module';
import { MandrillModule } from '../../clients/mandrill/mandrill.module';

@Module({
    controllers: [
        RegistrationsController,
    ],
    components: [
        RegistrationsService,
    ],
    imports: [
        GocardlessModule,
        MandrillModule,
        TypeOrmModule.forFeature([Registration]),
    ],
})
export class RegistrationsModule {}
