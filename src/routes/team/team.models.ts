import { Team } from './team.entity';

import { StandardResponse } from '../../utils/models/standard-response.model';

import { ClubResult } from '../club/club.models';
import { GameVsResult } from '../game/game.models';

export class TeamResult {
    id: number;
    name: string;
    club?: ClubResult;
    games?: GameVsResult[];
    teams?: TeamResult[];

    constructor(data: Team, fields: string[] = []) {
        this.id = data.id;
        this.name = data.name;

        if (fields.indexOf('club') >= 0) {
            this.club = new ClubResult(data.club);
        }

        if (fields.indexOf('games') >= 0) {
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
            this.results = data.map(t => new TeamResult(t, ['club']));
        } else {
            this.results = [new TeamResult(data, ['club', 'games'])];
        }
    }
}