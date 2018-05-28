import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Location } from './locations.entity';
import { LocationResult } from './locations.models';

@Component()
export class LocationsService {

    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    ) {}

    public async findAll(): Promise<LocationResult[]> {
        return (await this.locationRepository.find())
            .map(l => new LocationResult(l));
    }
}
