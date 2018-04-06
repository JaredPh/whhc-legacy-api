import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class ESession {

    @PrimaryColumn()
    id: string;

    @Column()
    member: number;

    @Column()
    cookie: string;

    @Column()
    access: string;

    @Column()
    refresh: string;

    @Column({ type: 'datetime' })
    expiry: Date;
}