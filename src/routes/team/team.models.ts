import { Team } from './team.entity';

import { StandardResponse } from '../../utils/models/standard-response.model';

import { ClubResult } from '../club/club.models';
import { GameVsResult } from '../game/game.models';

export class TeamResult {
    id: number;
    name: string;
    club: ClubResult;
    games?: GameVsResult[];

    constructor(data: Team, full: boolean = false) {
        this.id = data.id;
        this.name = data.name;
        this.club = new ClubResult(data.club);

        if (full) {
            this.games = [...data.homeGames, ...data.awayGames]
                .map(g => new GameVsResult(g))
                .sort((a, b) => a.date.localeCompare(b.date));
        }
    }
}

export class TeamResponse extends StandardResponse {
    results: TeamResult[];

    constructor(data) {
        super();

        if (Array.isArray(data)) {
            this.results = data.map(t => new TeamResult(t));
        } else {
            this.results = [new TeamResult(data, true)];
        }
    }
}