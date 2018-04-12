import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Member } from './members.entity';
import { MemberPostRegistrationRequest } from './members.models';

@Component()
export class MembersService {

    constructor(
        @InjectRepository(Member) private readonly membersRepository: Repository<Member>,
    ) {}

    public async findAll(): Promise<Member[]> {
        return await this.membersRepository.find();
    }

    public async findOneByUserId(userId: string): Promise<Member> {
        return await this.membersRepository.findOne({ userId });
    }

    public async findOneByEmail(email: string): Promise<Member> {
        return await this.membersRepository.findOne({ email });
    }

    public async save(member: Member): Promise<Member> {
        return await this.membersRepository.save(member);
    }
}