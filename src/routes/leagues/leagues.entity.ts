import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('competitions')
export class League {

    @PrimaryColumn()
    id: string;

    @Column()
    division: string;

    @Column({ nullable: true })
    structure: string;

    @Column()
    active: boolean;
}
