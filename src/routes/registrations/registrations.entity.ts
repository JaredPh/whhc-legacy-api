import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('registrations')
export class Registration {

    @PrimaryGeneratedColumn()
    id?: string;

    @Column({ nullable: false })
    fname: string;

    @Column({ nullable: false })
    lname: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: false })
    team: string;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: false })
    membership: string;

    @Column({ nullable: false })
    installments: string;

    @Column({ type: 'datetime', nullable: false })
    date: Date;

    @Column({ nullable: true })
    token?: string;

    @Column({ nullable: true })
    redirect?: string;

    @Column({ nullable: true })
    mandate?: string;

    @Column({ nullable: true })
    payment1?: string;

    @Column({ nullable: true })
    payment2?: string;
}
