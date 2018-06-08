import { IsString } from 'class-validator';

import { Member } from './members.entity';
import { ImageResult } from '../images/images.models';

import { Image } from '../images/images.entity';

/* Todo: make more elegant */
const placeholderAvatarImage: Image = {
    id: 0,
    name: '3ffe537a-f893-4824-9b50-5af5008acf01',
    ext: 'png',
    width: 96,
    height: 96,
    description: 'placeholder avatar',
};

export class MemberResult {
    id: number;
    email: string;
    fname: string;
    lname: string;
    avatar: ImageResult;

    roles: string[];

    constructor(
        data: Member,
        includeRoles?: boolean,
    ) {
        this.id = data.id;

        this.email = data.email;

        this.fname = data.fname;
        this.lname = data.lname;

        this.avatar = (data.avatar)
            ? new ImageResult(data.avatar)
            : new ImageResult(placeholderAvatarImage);

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
