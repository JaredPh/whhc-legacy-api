import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToOne, Column, JoinColumn } from 'typeorm';

import { Location } from '../location/location.entity';
import { Team } from '../team/team.entity';

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'time', nullable: true })
    time: string;

    @ManyToOne(type => Team, team => team.id)
    homeTeam: Team;

    @Column({ nullable: true })
    homeScore: number;

    @ManyToOne(type => Team, team => team.id)
    awayTeam: Team;

    @Column({ nullable: true })
    awayScore: number;

    @Column()
    format: string;

    @Column()
    status: string;

    @ManyToOne(type => Location, location => location.id)
    location: Location;


    // umpires
}
