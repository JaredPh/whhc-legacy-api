import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Member } from './models/members.entity';

@Component()
export class MembersService {

    constructor(
        @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    ) {}
}