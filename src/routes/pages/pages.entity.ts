import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../images/images.entity';

@Entity('pages')
export class Page {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    slug: string;

    @Column({ nullable: true })
    weight: number;

    @ManyToOne(type => Page, page => page.children)
    parent: Page;

    @OneToMany(type => Page, page => page.parent)
    children: Page[];

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    banner: Image;

    @Column({ length: '16', nullable: false })
    type: 'location' | 'contacts' | 'custom' | 'landing';

    @Column({ nullable: true })
    reference?: number;

    @Column({ nullable: false })
    heading: string;

    @Column({ length: '155', nullable: false })
    description: string;

    @Column({ length: '4000', nullable: false })
    body: string;
}
