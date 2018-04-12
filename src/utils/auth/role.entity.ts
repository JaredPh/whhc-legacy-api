import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { Member } from '../../routes/members/members.entity';

@Entity('roles')
export class Role {

    @PrimaryColumn()
    id: string;

    @ManyToMany(type => Member)
    members: Member[];
}