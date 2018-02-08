import { IGame } from '../../../utils/interfaces/Game.interface';
import { ILocation } from '../../../utils/interfaces/Location.interface';
import { ITeam } from '../../../utils/interfaces/Team.interface';

export class ClubResponse {
    id: number;
    name: string;
    teams: ITeam;
    locations: ILocation;
    games: IGame;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.teams = data.teams.map((team): ITeam => {
            return {
                id: team.id,
                name: team.name,
                type: team.type,
            };
        });

        this.games = data.teams.reduce((array, team) => {
            return [...array, ...team.homeGames, ...team.awayGames];
        }, []);

        this.locations = data.locations;
    }
}