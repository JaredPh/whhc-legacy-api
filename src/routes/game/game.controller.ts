import { Controller, Get, HttpStatus, NotFoundException, Param, Request, Req } from '@nestjs/common';

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
        @Req() req: Request,
    ): Promise<GamesResponse> {
        const result = await this.gameService.findOne(id);

        if (!result) throw new NotFoundException(`Cannot GET ${req.originalUrl}`, HttpStatus.NOT_FOUND);

        return new GamesResponse(result);
    }
}