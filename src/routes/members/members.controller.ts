import { Controller, Get } from '@nestjs/common';

import { User, UserRoles } from '../../utils/auth/auth.decorators';

import { MembersService } from './members.service';
import { Member } from './members.entity';
import { MemberResponse } from './members.models';

@Controller('members')
export class MembersController {

    constructor(
        private readonly membersService: MembersService,
    ) {}

    @Get()
    @UserRoles(['committee'])
    async getAllMembers(
    ): Promise<any> { // todo: add type
        const members = (await this.membersService.findAll())
            .map(m => new MemberResponse(m));

        return { members };
    }

    @Get('current')
    @UserRoles(['member'])
    async getCurrentMember(
        @User() currentUser: Member,
    ): Promise<any> {
        const member = new MemberResponse(await currentUser);

        return { member };
    }
}
