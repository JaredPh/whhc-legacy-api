import { Controller, Get, Param, Request } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResponse } from './games.interfaces';
import { GameResult } from './games.model';

@Controller('games')
export class GamesController {

    constructor(
        private readonly gamesService: GamesService,
    ) {}

    @Get()
    async getAllEvents(
        @Request() req: any,
    ): Promise<GamesResponse> {
        const queryParams = req.query;

        const games = (await this.gamesService.find(queryParams))
            .map(g => new GameResult(g));

        return { results: games };
    }
}
