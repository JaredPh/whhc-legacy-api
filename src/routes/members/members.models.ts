import { IsString } from 'class-validator';

import { Member } from './members.entity';

export class MemberResult {
    id: number;
    email: string;
    fname: string;
    lname: string;
    roles: string[];

    constructor(data: Member) {
        this.id = data.id;

        this.email = data.email;

        this.fname = data.fname;
        this.lname = data.lname;

        this.roles = data.roles.map(role => role.id);
    }
}

export class MemberPostRegistrationRequest {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly fname: string;

    @IsString()
    readonly lname: string;
}