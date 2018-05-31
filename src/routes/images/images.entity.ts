import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    ext: string;

    @Column()
    description: string;

    @Column()
    width: number;

    @Column()
    height: number;
}