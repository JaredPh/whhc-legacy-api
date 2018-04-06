import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class EMember {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column()
    email: string;

    @Column()
    mobile: string;

    @Column()
    password: string;
}