import { Entity, Column, PrimaryColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Image } from '../images/images.entity';
import { Tag } from '../tags/tags.entity';
import { Member } from '../members/members.entity';

@Entity('news')
export class News {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: false })
    heading: string;

    @Column({ length: '4000', nullable: false })
    body: string;

    @Column({ nullable: true })
    video?: string;

    @Column({ type: 'datetime', nullable: false })
    date: Date;

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    thumb: Image;

    @ManyToOne(type => Image, { eager: true, nullable: false })
    @JoinColumn()
    background: Image;

    @ManyToMany(type => Image, { eager: true, nullable: true, cascade: false })
    @JoinTable({
        name: 'news_images',
        joinColumn: {
            name: 'news',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'image',
            referencedColumnName: 'id',
        },
    })
    photos: Image[];

    @ManyToOne(type => Member, { eager: true, nullable: false })
    @JoinColumn()
    author: Member;

    @ManyToMany(type => Tag, { eager: true, nullable: true, cascade: true })
    @JoinTable({
        name: 'news_tags',
        joinColumn: {
            name: 'news',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];
}