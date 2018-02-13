import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

import { Game } from '../game/game.entity';
import { Club } from '../club/club.entity';

@Entity()
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 64 })
    name: string;

    @Column({ length: 128 })
    address: string;

    @Column({ length: 64 })
    town: string;

    @Column({ length: 8 })
    postcode: string;

    @ManyToMany(type => Club, club => club.locations)
    clubs: Club[];

    @OneToMany(type => Game, game => game.location)
    games: Game[];
}