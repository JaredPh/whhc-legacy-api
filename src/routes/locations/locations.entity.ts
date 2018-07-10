import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Club } from '../clubs/clubs.entity';

@Entity('locations')
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heading: string;

    @Column()
    address: string;

    @Column()
    home: boolean;

    @ManyToMany(type => Club, { eager: false, nullable: true, cascade: true })
    @JoinTable({
        name: 'clubs_locations',
        joinColumn: {
            name: 'location',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'club',
            referencedColumnName: 'id',
        },
    })
    clubs: Club[];
}
