import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../locations/locations.entity';
import { Image } from '../images/images.entity';

@Entity('clubs')
export class Club {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column()
    short: string;

    @ManyToOne(type => Image, { eager: true, nullable: false })
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
}
