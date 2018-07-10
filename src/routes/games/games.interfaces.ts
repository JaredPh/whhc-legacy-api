import { GameResult } from './games.model';

export interface GamesResponse {
    results: GameResult[];
}

export interface GamesQueryParams {
    count?: number;
    future?: 'true' | 'false';
    past?: 'true' | 'false';
    start?: string;
    end?: string;
}
