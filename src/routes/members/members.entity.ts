import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

import { Role } from '../../utils/auth/role.entity';

@Entity('members')
export class Member {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true, default: null })
    userId: string;

    @Column({ unique: true, nullable: true, default: null })
    email: string;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @ManyToMany(type => Role, { eager: true })
    @JoinTable({
        name: 'members_roles',
        joinColumn: {
            name: 'members',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}