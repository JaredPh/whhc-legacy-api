import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('competitions')
export class League {

    @PrimaryColumn()
    id: string;

    @Column()
    division: string;

    @Column()
    structure: string;

    @Column()
    active: boolean;
}
