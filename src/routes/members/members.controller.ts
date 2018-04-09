import { Controller, Get } from '@nestjs/common';

import { MembersService } from './members.service';
import { User, UserRoles } from '../../utils/auth/auth.decorators';
import { Member } from './members.entity';

@Controller('members')
export class MembersController {

    constructor(
        private readonly membersService: MembersService,
    ) {}

    @Get()
    @UserRoles(['committee'])
    async getAllMembers(
    ): Promise<Member[]> {
        return await this.membersService.findAll();
    }

    @Get('current')
    @UserRoles(['member'])
    async getCurrentMember(
        @User() currentUser: Member,
    ): Promise<Member> {
        return await currentUser;
    }
}
