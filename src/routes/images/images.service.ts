import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from './images.entity';

@Component()
export class ImagesService {

    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    ) {}

    public async findAll(): Promise<Image[]> {
        return await this.imageRepository.find();
    }
}
