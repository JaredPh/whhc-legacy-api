import { Controller, Get, Param } from '@nestjs/common';

import { GameService } from './game.service';
import { GamesResponse } from './game.models';

@Controller('games')
export class GameController {

    constructor(
        private readonly gameService: GameService,
    ) {}

    @Get()
    async findAll(): Promise<GamesResponse> {
        return new GamesResponse(await this.gameService.findAll());
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
    ): Promise<GamesResponse> {
        return new GamesResponse(await this.gameService.findOne(id));
    }
}
