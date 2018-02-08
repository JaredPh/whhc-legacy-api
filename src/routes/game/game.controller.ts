import { Controller, Get, Param } from '@nestjs/common';

import { GameService } from './game.service';

@Controller('games')
export class GameController {

    constructor(
        private readonly gameService: GameService,
    ) {}

    @Get()
    async findAll(): Promise<any[]> {
        return this.gameService.findAll();
    }

    @Get('results')
    async findAll(): Promise<any[]> {
        return this.gameService.findRecentResults();
    }

    @Get(':id')
    async findOne(
        @Param() params,
    ): Promise<any> {
        return this.gameService.findOne(params.id);
    }

}
