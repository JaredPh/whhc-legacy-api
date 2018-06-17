import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { Image } from '../images/images.entity';

@Entity('pages')
export class Page {

    @PrimaryColumn()
    id: string;

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
    type: 'location' | 'contacts' | 'custom';

    @Column({ nullable: true })
    reference: number;

    @Column({ nullable: false })
    heading: string;

    @Column({ length: '4000', nullable: false })
    body: string;
}
