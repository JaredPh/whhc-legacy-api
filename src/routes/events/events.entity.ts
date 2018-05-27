import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Image } from '../images/images.entity';

@Entity('events')
export class Event {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: false })
    heading: string;

    @OneToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    thumb: Image;

    @Column({ type: 'datetime', nullable: false })
    start: Date;

    @Column({ type: 'datetime', nullable: false })
    end: Date;
}