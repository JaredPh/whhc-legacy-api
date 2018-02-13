import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Location } from './location.entity';

const relations = ['clubs'];

@Component()
export class LocationService {

    constructor(
        @Inject('LocationRepositoryToken') private readonly locationRepository: Repository<Location>,
    ) {}

    async findAll(): Promise<Location[]> {
        return await this.locationRepository.find({ relations });
    }

    async findOne(id: number): Promise<Location> {
        return await this.locationRepository.findOneById(
            id, { relations },
        );
    }

}