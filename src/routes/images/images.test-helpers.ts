import { Image } from './images.entity';
import { Repository } from 'typeorm';

export class ImageRepository extends Repository<Image> {}

export class ImagesService {
    findAll() {}
}

export const mockImages: Image[] = [
    {
        id: 'imageOne',
        ext: 'png',
        width: 1,
        height: 2,
        description: 'image 1 desc',
    },
    {
        id: 'imageTwo',
        ext: 'gif',
        width: 3,
        height: 4,
        description: 'image 2 desc',
    },
    {
        id: 'imageThree',
        ext: 'jpg',
        width: 5,
        height: 6,
        description: 'image 3 desc',
    },
];