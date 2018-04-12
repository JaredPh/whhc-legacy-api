import { BadRequestException, Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { MembersService } from './members.service';
import { Member } from './members.entity';
import { MemberPostRegistrationRequest, MemberResult } from './members.models';
import { MembersResponse } from './members.interfaces';

import { LamdaEvent, User, UserRoles } from '../../utils/auth/auth.decorators';

import { Role } from '../../utils/auth/role.entity';

import { errorMessages } from '../../utils/errors/error.messages';

@Controller('members')
export class MembersController {

    constructor(
        private readonly membersService: MembersService,
    ) {}

    @Get()
    @UserRoles(['committee'])
    async getAllMembers(
    ): Promise<MembersResponse> {
        const members = (await this.membersService.findAll())
            .map(m => new MemberResult(m));

        return { members };
    }

    @Get('current')
    @UserRoles(['member'])
    async getCurrentMember(
        @User() currentUser: Member,
    ): Promise<MembersResponse> {
        const member = new MemberResult(await currentUser);

        return { members: [ member ] };
    }

    @Post()
    @LamdaEvent('cognitoPostRegistration')
    async createMemberPostCognitoRegistration(
        @Body(new ValidationPipe()) newMember: MemberPostRegistrationRequest,
    ): Promise<MembersResponse> {
        let member: Member;

        const existingMember = await this.membersService.findOneByEmail(newMember.email);

        if (existingMember) {
            if (existingMember.userId) throw new BadRequestException(errorMessages.MEMBER_ALREADY_EXISTS);

            member = existingMember;
        } else {
            member = new Member();
            member.email = newMember.email;

            const role = new Role();
            role.id = 'member';

            member.roles = [ role ];
        }

        member.userId = newMember.userId;
        member.fname = newMember.fname;
        member.lname = newMember.lname;

        member = await this.membersService.save(member);

        return { members: [ new MemberResult(member) ] };
    }
}
