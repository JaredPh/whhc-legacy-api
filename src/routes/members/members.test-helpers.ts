import { Member } from './members.entity';
import { Role } from '../../utils/auth/role.entity';

import { Repository } from 'typeorm';

export class MemberRepository extends Repository<Member> {}

const adminRole = new Role();
const memberRole = new Role();

adminRole.id = 'admin';
memberRole.id = 'member';

export const mockMembers: Member[] = [
    {
        id: 1,
        userId: 'abcdef01-abcd-1234-7890-abcdefabcdef',
        email: 'name1@email.com',
        fname: 'Jane',
        lname: 'Doe',
        roles: [
            adminRole,
            memberRole,
        ],
        gender: 'M',
        avatar: {
            id: 2,
            name: 'someUrl',
            ext: 'jpg',
            description: 'image-description',
            width: 1,
            height: 2,
        },
    },
    {
        id: 2,
        userId: null,
        email: 'name2@email.com',
        fname: 'Joe',
        lname: 'Blogs',
        roles: [],
        gender: 'F',
        avatar: {
            id: 1,
            name: 'someUrl',
            ext: 'jpg',
            description: 'image-description',
            width: 1,
            height: 2,
        },
    },
    {
        id: 1,
        userId: 'abcdef01-abcd-1234-7890-abcdefabcdef',
        email: 'name3@email.com',
        fname: 'Billy',
        lname: 'Bob',
        gender: 'X',
        roles: [
            memberRole,
        ],
        avatar: null,
    },
];
