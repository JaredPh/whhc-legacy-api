import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../locations/locations.entity';

@Entity('clubs')
export class Club {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @ManyToMany(type => Location, { eager: true, nullable: true, cascade: true })
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
}
