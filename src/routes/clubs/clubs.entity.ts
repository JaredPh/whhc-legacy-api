import {
    Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { Location } from '../locations/locations.entity';
import { Image } from '../images/images.entity';
import { Team } from '../teams/teams.entity';

@Entity('clubs')
export class Club {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column()
    short: string;

    @OneToMany(type => Team, team => team.club)
    teams: Team[];

    @ManyToOne(type => Image, { eager: false, nullable: false })
    @JoinColumn()
    logo?: Image;

    @ManyToMany(type => Location, { eager: false, nullable: true, cascade: true })
    @JoinTable({
        name: 'clubs_locations',
        joinColumn: {
            name: 'club',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'location',
            referencedColumnName: 'id',
        },
    })
    clubs: Club[];

    @RelationId((club: Club) => club.teams)
    teamIds: number[];
}
