import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from './images.entity';
import { ImageResult } from './images.models';

@Component()
export class ImagesService {

    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    ) {}

    public async findAll(): Promise<ImageResult[]> {
        return (await this.imageRepository.find())
            .map(i => new ImageResult(i));
    }
}
