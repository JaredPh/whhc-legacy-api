import { LocationResult } from '../locations/locations.models';
import { ImageResult } from '../images/images.models';

export class CompetitionResult { // todo: move
    id: string;
    division: string;
    structure: string;
    active: string;

    constructor(data: any) {
        this.id = data.id;
        this.division = data.division;
        this.structure = data.structure;
        this.active = data.active;
    }
}

export class ClubResult { // todo: move
    id: number;
    short: string;
    name: string;
    logo: ImageResult;

    constructor(data: any) {
        this.id = data.id;
        this.short = data.short;
        this.name = data.name;
        this.logo = new ImageResult(data.logo);
    }
}

export class TeamResult { // todo: move
    id: number;
    short: string;
    name: string;
    type: string;
    club: ClubResult;

    constructor(data: any) {
        this.id = data.id;
        this.short = data.short;
        this.name = data.name;
        this.type = data.type;

        this.club = new ClubResult(data.club);
    }
}

export class GameResult {
    id: number;
    date: string;
    time: string;
    status: 'pending' | 'result' | 'postponed' | 'cancelled';
    competition: CompetitionResult;
    homeTeam: TeamResult;
    awayTeam: TeamResult;
    homeScore?: number;
    awayScore?: number;
    location?: LocationResult;

    constructor(data: any) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.status = data.status;
        this.competition = data.competition;
        this.homeTeam = new TeamResult(data.homeTeam);
        this.awayTeam = new TeamResult(data.awayTeam);
        this.homeScore = data.homeScore;
        this.awayScore = data.awayScore;

        if (data.location) {
            this.location = new LocationResult(data.location);
        }
    }
}
