import { Controller, Get, Param, Request } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResponse } from './games.interfaces';
import { GameResult } from './games.model';
import { LocationsService } from '../locations/locations.service';

@Controller('games')
export class GamesController {

    constructor(
        private readonly gamesService: GamesService,
        private readonly locationsService: LocationsService,
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

    @Get(':id')
    async getEventById(
        @Param('id') id: any,
    ): Promise<any> {
        const game: any = new GameResult(await this.gamesService.findOne(+id));

        if (game.location) {
            game.location.setMap(this.locationsService.getMap(game.location));
        }

        game.setSimilar(await this.gamesService.findSimilar(game));

        return { results: [ game ] };
    }
}
