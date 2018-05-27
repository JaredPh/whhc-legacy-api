import { CreateDateColumn, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('images')
export class Image {

    @PrimaryColumn()
    id: string;

    @Column()
    extension: string;

    @Column()
    description: string;

    @Column()
    width: number;

    @Column()
    height: number;

    @CreateDateColumn()
    createdDate: Date;
}