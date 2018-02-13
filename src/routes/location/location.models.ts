import { Location } from './location.entity';
import { StandardResponse } from '../../utils/models/standard-response.model';
import { ClubResult } from '../club/club.models';

export class LocationResult {
    id: number;
    name: string;
    address: string;
    town: string;
    postcode: string;
    clubs?: ClubResult[];

    constructor(data: Location, fields: string[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.address = data.address;
        this.town = data.town;
        this.postcode = data.postcode;

        if (fields.indexOf('clubs') >= 0) {
            this.clubs = data.clubs.map(c => new ClubResult(c));
        }
    }
}

export class LocationResponse extends StandardResponse {
    results: LocationResult[];

    constructor(data) {
        super();

        if (Array.isArray(data)) {
            this.results = data.map(l => new LocationResult(l));
        } else {
            this.results = [new LocationResult(data, ['clubs'])];
        }
    }
}