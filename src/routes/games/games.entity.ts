import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from '../teams/teams.entity';
import { Location } from '../locations/locations.entity';
import { League } from '../leagues/leagues.entity';

@Entity('games')
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'time', nullable: true })
    time: number;

    @Column({ nullable: false })
    status: 'pending' | 'result' | 'postponed' | 'cancelled';

    @ManyToOne(type => League, { eager: true, nullable: false })
    @JoinColumn()
    competition: League;

    @ManyToOne(type => Team, { eager: true, nullable: false })
    @JoinColumn()
    homeTeam: Team;

    @ManyToOne(type => Team, { eager: true, nullable: false })
    @JoinColumn()
    awayTeam: Team;

    @Column({ nullable: true })
    homeScore: number;

    @Column({ nullable: true })
    awayScore: number;

    @ManyToOne(type => Location, { eager: true, nullable: true })
    @JoinColumn()
    location: Location;
}
