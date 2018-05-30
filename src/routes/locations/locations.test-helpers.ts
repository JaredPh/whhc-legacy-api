import { Location } from './locations.entity';
import { Repository } from 'typeorm';

export class LocationRepository extends Repository<Location> {}

export class LocationsService {
    findAll() {}
}

export const mockLocations: Location[] = [
    {
        id: 1,
        heading: 'my house',
        address: 'my street, my town, my postcode',
    },
    {
        id: 2,
        heading: 'your house',
        address: 'your street, your town, your postcode',
    },
];