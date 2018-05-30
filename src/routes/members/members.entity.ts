import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn} from "typeorm";

import { Role } from '../../utils/auth/role.entity';
import {Image} from "../images/images.entity";

@Entity('members')
export class Member {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true, nullable: true, default: null })
    userId: string;

    @Column({ unique: true, nullable: true, default: null })
    email: string;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column()
    gender: string;

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    avatar: Image;

    @ManyToMany(type => Role, { eager: true })
    @JoinTable({
        name: 'members_roles',
        joinColumn: {
            name: 'member',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}