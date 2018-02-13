import { Location } from './location.entity';

export class LocationResult {
    id: number;
    name: string;
    address: string;
    town: string;
    postcode: string;

    constructor(data: Location, full: boolean = false) {
        this.id = data.id
        this.name = data.name;
        this.address = data.address;
        this.town = data.town;
        this.postcode = data.postcode;

        if (full) {
            // TODO: add full mode to location result
        }
    }
}