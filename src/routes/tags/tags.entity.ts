import { Entity, PrimaryColumn } from 'typeorm';

@Entity('tags')
export class Tag {

    @PrimaryColumn()
    id: string;
}