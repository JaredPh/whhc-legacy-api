import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GoogleMapsService } from '../../clients/google/google-maps.service';

import { Location } from './locations.entity';
import { LocationResult } from './locations.models';
import { LocationTransportResult } from './locations.interfaces';

@Component()
export class LocationsService {

    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
        private googleMapsService: GoogleMapsService,
    ) {}

    public async findOne(id: number): Promise<Location> {
        return await this.locationRepository.findOne(id);
    }

    public getMap(location: LocationResult) {
        return this.googleMapsService.getMap(location);
    }

    public async getTransport(location: LocationResult, start: string): Promise<LocationTransportResult> {
        return {
            driving: await this.googleMapsService.getDrivingTime(location, start),
            transit: await this.googleMapsService.getTransitTime(location, start),
        };
    }
}
