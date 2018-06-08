import { Location } from './locations.entity';
import { Repository } from 'typeorm';
import { GoogleMapImage } from '../../clients/google/google.interfaces';
import { LocationDrivingResult, LocationTransitResult } from './locations.interfaces';

export class LocationRepository extends Repository<Location> {}

export class LocationsService {
    findOne() {}
    getTransport() {}
    getMap() {}
}

export const mockLocations: Location[] = [
    {
        id: 1,
        heading: 'my house',
        address: 'my street, my town, my postcode',
        home: true,
    },
    {
        id: 2,
        heading: 'your house',
        address: 'your street, your town, your postcode',
        home: false,
    },
];

export const mockMapImage: GoogleMapImage = {
    url: 'https://mapUrl.com',
    image: {
        url: 'https://mapImageUrl.png',
        description: 'map desc',
        width: 640,
        height: 480,
    },
};

export const mockDriving: LocationDrivingResult = {
    distance: 123456,
    time: 123456,
    traffic: 12345,
};

export const mockTransit: LocationTransitResult = {
    time: 234567,
};
