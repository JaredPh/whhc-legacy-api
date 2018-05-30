import { Location } from './locations.entity';

export class LocationResult {
    id: number;
    heading: string;
    address: string;

    constructor(data: Location) {
        this.id = data.id;
        this.heading = data.heading;
        this.address = data.address;
    }
}