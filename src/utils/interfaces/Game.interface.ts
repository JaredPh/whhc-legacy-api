import { ITeam } from './Team.interface';

export interface IGame {
    id: number;
    date: string;
    time: string;
    format: 'cup' | 'league' | 'friendly';
    status: string;
    homeTeam: ITeam;
    awayTeam: ITeam;
}
