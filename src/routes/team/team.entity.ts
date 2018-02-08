import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Club } from '../club/club.entity';
import { Game } from '../game/game.entity';

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    name: string;

    @ManyToOne(type => Club, club => club.id, { cascadeUpdate: true })
    club: Club;

    @Column({ length: 16 })
    type: string;

    @OneToMany(type => Game, game => game.homeTeam)
    homeGames: Game[];

    @OneToMany(type => Game, game => game.awayTeam)
    awayGames: Game[];;
}