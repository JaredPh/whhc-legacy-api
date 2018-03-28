import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class Session {

    @PrimaryColumn()
    id: string;

    @Column()
    member: number;

    @Column()
    cookie: string;

    @Column()
    access: string;

    @Column({ type: 'datetime' })
    accessExpiry: Date;

    @Column()
    refresh: string;

    @Column({ type: 'datetime' })
    refreshExpiry: Date;
}