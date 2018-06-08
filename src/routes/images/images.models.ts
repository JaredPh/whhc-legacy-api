import { Image } from './images.entity';

export class ImageResult {
    url: string;
    description: string;
    width: number;
    height: number;

    constructor(data: Image) {
        this.url = `${process.env.MEDIA_ADDRESS}/${data.name}.${data.ext}`; // Todo: make process.env

        this.description = data.description;

        this.width = data.width;
        this.height = data.height;
    }
}
