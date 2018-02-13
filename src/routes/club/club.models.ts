import { Club } from './club.entity';
import { StandardResponse } from '../../utils/models/standard-response.model';
import { TeamResult } from '../team/team.models';
import { LocationResult } from '../location/location.models';

export class ClubResult {
    id: number;
    name: string;
    teams: TeamResult[];
    locations: LocationResult[];

    constructor(data: Club, fields: string[] = []) {
        this.id = data.id;
        this.name = data.name;

        if (fields.indexOf('location') >= 0) {
            this.locations = data.locations.map(l => new LocationResult(l));
        }

        if (fields.indexOf('teams') >= 0) {
           this.teams = data.teams.map(t => new TeamResult(t));
        }
    }
}

export class ClubResponse extends StandardResponse {
    results: ClubResult[];

    constructor(data) {
        super();

        if (Array.isArray(data)) {
            this.results = data.map(c => new ClubResult(c));
        } else {
            this.results = [new ClubResult(data, ['location', 'teams'])];
        }
    }
}