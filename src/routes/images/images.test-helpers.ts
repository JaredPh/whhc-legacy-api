import { Image } from './images.entity';
import { Repository } from 'typeorm';

export class ImageRepository extends Repository<Image> {}

export class ImagesService {
    findAll() {}
}

export const mockImages: Image[] = [
    {
        id: 1,
        name: 'imageOne',
        ext: 'png',
        width: 1,
        height: 2,
        description: 'image 1 desc',
    },
    {
        id: 2,
        name: 'imageTwo',
        ext: 'gif',
        width: 3,
        height: 4,
        description: 'image 2 desc',
    },
    {
        id: 3,
        name: 'imageThree',
        ext: 'jpg',
        width: 5,
        height: 6,
        description: 'image 3 desc',
    },
];
