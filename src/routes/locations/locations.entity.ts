import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heading: string;

    @Column()
    address: string;
}