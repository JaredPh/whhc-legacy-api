import { Entity, Column, PrimaryColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Image } from '../images/images.entity';
import { Location } from '../locations/locations.entity';
import { Tag } from '../tags/tags.entity';
import { Member } from '../members/members.entity';

@Entity('events')
export class Event {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: false })
    heading: string;

    @Column({ length: '4000', nullable: false })
    body: string;

    @Column({ type: 'datetime', nullable: false })
    start: Date;

    @Column({ type: 'datetime', nullable: false })
    end: Date;

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    thumb: Image;

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    background: Image;

    @ManyToOne(type => Location, { eager: true, nullable: true })
    @JoinColumn()
    location: Location;

    @ManyToOne(type => Member, { eager: true, nullable: false })
    @JoinColumn()
    author: Member;

    @ManyToMany(type => Tag, { eager: true, nullable: true, cascade: true })
    @JoinTable({
        name: 'events_tags',
        joinColumn: {
            name: 'event',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];
}