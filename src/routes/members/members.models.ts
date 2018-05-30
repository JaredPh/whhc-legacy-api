import { IsString } from 'class-validator';

import { Member } from './members.entity';
import { ImageResult } from '../images/images.models';

export class MemberResult {
    id: number;
    email: string;
    fname: string;
    lname: string;
    avatar: ImageResult;

    roles: string[];

    constructor(data: Member, includeRoles?: boolean) {
        this.id = data.id;

        this.email = data.email;

        this.fname = data.fname;
        this.lname = data.lname;

        this.avatar = (data.avatar)
            ? new ImageResult(data.avatar)
            : null;

        if (includeRoles) {
            this.roles = data.roles.map(role => role.id);
        }
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

    @IsString()
    readonly gender: string;
}