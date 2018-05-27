import { Image } from './images.entity';

export class ImageResult {
    url: string;
    description: string;
    width: number;
    height: number;

    constructor(data: Image) {
        this.url = `https://media.whhc.uk/public/${data.id}.${data.extension}`;

        this.description = data.description;

        this.width = data.width;
        this.height = data.height;
    }
}