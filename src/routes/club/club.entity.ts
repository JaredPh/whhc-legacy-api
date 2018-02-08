import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';

import { Team } from '../team/team.entity';
import { Location } from '../location/location.entity';

@Entity()
export class Club {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128, unique: true })
    name: string;

    @OneToMany(type => Team, team => team.club)
    @JoinTable()
    teams: Team[];

    @ManyToMany(type => Location, location => location.id)
    @JoinTable()
    locations: Location[];
}
