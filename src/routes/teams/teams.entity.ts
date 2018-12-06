import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Member } from '../members/members.entity';
import { Club } from '../clubs/clubs.entity';

@Entity('teams')
export class Team {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    short: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    type: 'mens' | 'ladies';

    // @ManyToOne(type => Member, { eager: true, nullable: false })
    // @JoinColumn()
    // captain: Member;

    @ManyToOne(type => Club, { eager: false, nullable: false })
    @JoinColumn()
    club: Club;
}
