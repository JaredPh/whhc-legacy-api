import { Game } from './game.entity';
import { TeamResult } from '../team/team.models';
import { LocationResult } from '../location/location.models';
import { StandardResponse } from '../../utils/models/standard-response.model';

export class GameScore {
    home: number;
    away: number;

    constructor(homeScore, awayScore) {
        this.home = homeScore;
        this.away = awayScore;
    }
}

export class GameVsResult {
    // TODO: rethink this
    id: number;
    date: string;
    time: string;
    home: boolean;
    oppoTeam: TeamResult;
    teamScore?: number;
    oppoScore?: number;
    format: string;
    status: string;
    location: LocationResult;

    constructor(data: Game) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.format = data.format;
        this.status = data.status;
        this.home = data.hasOwnProperty('awayTeam');

        if (data.location) {
            this.location = new LocationResult(data.location);
        }

        this.oppoTeam = new TeamResult((this.home) ? data.awayTeam : data.homeTeam);

        if (this.status === 'result') {
            this.teamScore = (this.home) ? data.homeScore : data.awayScore;
            this.oppoScore = (this.home) ? data.awayScore : data.homeScore;
        }
    }
}

export class GameResult {
    id: number;
    date: string;
    time: string;
    format: string;
    status: string;
    homeTeam: TeamResult;
    awayTeam: TeamResult;
    score?: GameScore;
    location?: LocationResult;

    constructor(data: Game, fields: string[] = []) {
        this.id = data.id;
        this.date = data.date;
        this.time = data.time;
        this.format = data.format;
        this.status = data.status;
        this.homeTeam = new TeamResult(data.homeTeam, ['club']);
        this.awayTeam = new TeamResult(data.awayTeam, ['club']);

        if (fields.indexOf('location') >= 0) {
            this.location = new LocationResult(data.location);
        }

        if (this.status === 'result') {
            this.score = new GameScore(data.homeScore, data.awayScore);
        }
    }
}

export class GamesResponse extends StandardResponse {
    results: GameResult[];

    constructor(data) {
        super();

        if (Array.isArray(data)) {
            this.results = data.map(g => new GameResult(g));
        } else {
            this.results = [new GameResult(data, ['location'])];
        }
    }
}
