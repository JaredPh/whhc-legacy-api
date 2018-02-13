import { Game } from './game.entity';
import { TeamResult } from '../team/team.models';
import { LocationResult } from '../location/location.models';

export class GameVsResult {
    id: number;
    date: string;
    time: string;
    home: boolean;
    oppoTeam: TeamResult;
    teamScore?: number;
    oppoScore?: number;
    format: 'league' | 'friendly' | 'cup';
    status: 'result' | 'sheduled' | 'postponed' | 'cancelled';
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