import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './utils/auth/auth.module';
import { MembersModule } from './routes/members/members.module';

@Module({
  imports: [
      AuthModule,
      MembersModule,
      TypeOrmModule.forRoot(),
  ],
})
export class ApplicationModule {}
