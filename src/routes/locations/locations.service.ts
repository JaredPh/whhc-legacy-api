import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Location } from './locations.entity';

@Component()
export class LocationsService {

    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    ) {}

    public async findAll(): Promise<Location[]> {
        return await this.locationRepository.find();
    }
}
