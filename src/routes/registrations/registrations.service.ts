import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';

import { Registration } from './registrations.entity';

@Component()
export class RegistrationsService {

    constructor(
        @InjectRepository(Registration) private readonly registrationRepository: Repository<Registration>,
    ) {}

    public async find(): Promise<Registration[]> {
        return await this.registrationRepository.find();
    }

    public async findByRedirect(id: string): Promise<Registration> {
        return await this.registrationRepository.findOne({
            where: { redirect: id },
        });
    }

    public async save(registration: any): Promise<Registration> {
        return await this.registrationRepository.save(registration);
    }

    public generateCode(registration: Registration) {
        const {
            id,
            fname,
            lname,
            installments,
            membership,
            team,
            status,
        } = registration;

        const earlybird: boolean = moment().isBefore('2018-10-15');

        const type = (team === 'U' || team === 'S' || team === 'X')
            ? team
            : membership;

        const prefix = (status === 'N')
            ? status
            : (earlybird)
                ? 'E'
                : 'L';

        return `${prefix}${installments}${type}${id}${fname.charAt(0)}${lname}`.toUpperCase().substr(0, 16);
    }

    public getInstallments(code: string): number[] {

        const prefix = code.substring(0, 3);

        let installments: number[];
        switch (prefix) {
            case 'E1U':
            case 'N1U':
            case 'L1U':
            case 'E2U':
            case 'N2U':
            case 'L2U':
                installments = [0];
                break;

            case 'E1X':
            case 'N1X':
            case 'L1X':
            case 'E2X':
            case 'N2X':
            case 'L2X':
                installments = [40];
                break;

            case 'E1A':
            case 'N1A':
                installments = [260];
                break;
            case 'L1A':
                installments = [275];
                break;
            case 'E2A':
            case 'N2A':
                installments = [140, 140];
                break;
            case 'L2A':
                installments = [155, 140];
                break;

            case 'E1S':
            case 'N1S':
                installments = [135];
                break;
            case 'L1S':
                installments = [150];
                break;
            case 'E2S':
            case 'N2S':
                installments = [75, 75];
                break;
            case 'L2S':
                installments = [90, 75];
                break;

            case 'E1G':
            case 'N1G':
            case 'E1K':
            case 'N1K':
                installments = [150];
                break;
            case 'L1G':
            case 'L1K':
                installments = [165];
                break;
            case 'E2G':
            case 'N2G':
            case 'E2K':
            case 'N2K':
                installments = [80, 80];
                break;
            case 'L2G':
            case 'L2K':
                installments = [95, 80];
                break;
        }

        return installments;
    }
}
