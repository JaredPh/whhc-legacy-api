import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { EMember } from './members.entity';

@Component()
export class MembersService {

    constructor(
        @InjectRepository(EMember)
    private readonly membersRepository: Repository<EMember>,
    ) {}
}