import { Member } from './members.entity';

export class MemberResponse {
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

        this.roles = data.roles
            .sort((roleA, RoleB) => roleA.weight - RoleB.weight)
            .map(role => role.id);
    }
}