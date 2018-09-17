import { Body, Controller, Get, Param, Post, Request, ValidationPipe } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationForm} from './registrations.models';
import { RegistrationFormBody, RegistrationsResponse } from './registrations.interfaces';
import { Registration } from './registrations.entity';
import { GocardlessService } from '../../clients/gocardless/gocardless.service';
import { GocardlessRedirectResult } from '../../clients/gocardless/gocardless.models';
import { MandrillService } from '../../clients/mandrill/mandrill.service';
import * as moment from 'moment';

@Controller('registrations')
export class RegistrationsController {

    constructor(
        private readonly registrationService: RegistrationsService,
        private readonly gocardlessService: GocardlessService,
        private readonly mandrillService: MandrillService,
    ) {}

    @Get()
    async getRegistrations(
        @Request() req: any,
    ): Promise<any> {
        return await this.registrationService.find();
    }

    @Post()
    async createRegistration(
        @Body(new ValidationPipe()) form: RegistrationFormBody,
    ): Promise<RegistrationsResponse> {
        const r = new RegistrationForm(form);

        let registration: Registration = await this.registrationService.save(r);

        let redirect: GocardlessRedirectResult;

        if (registration.installments === '2') {
            redirect = await this.gocardlessService.generateRedirect(registration);

            registration.redirect = redirect.id;
            registration.token = redirect.token;

            registration = await this.registrationService.save(r);
        }

        const code = this.registrationService.generateCode(registration);

        if (registration.installments === '1') {
            await this.mandrillService.sendTemplate({
                key: 'gzCgoHgb1Ae7CSdwXDAenA',
                template_name: 'member-payment-details',
                template_content: [
                    { name: 'fname', content: registration.fname },
                    { name: 'lname', content: registration.lname },
                    { name: 'total', content: `${this.registrationService.getInstallments(code)[0]}.00` },
                    { name: 'ref', content: code },
                ],
                message: {
                    to: [
                        { email: registration.email, type: 'to' },
                        { email: 'mail@jared.ph', type: 'bcc' },
                    ],
                },
            });
        }

        return { results: [{
            code,
            status: (registration.installments === '2') ? 'DD' : 'BT',
            redirect: (redirect) ? redirect.url : null,
        }]};
    }

    @Get(':id')
    async completeRegistration(
        @Param('id') id: string,
    ): Promise<any> {
        let registration: Registration = await this.registrationService.findByRedirect(id);

        const gocardlessResult = await this.gocardlessService.completeRedirect(id, registration.token);

        registration.mandate = gocardlessResult.mandate;

        registration = await this.registrationService.save(registration);

        const code = this.registrationService.generateCode(registration);
        const installments = this.registrationService.getInstallments(code);

        const payment1 = this.gocardlessService.requestPayment(code, registration.mandate, 'Membership 1st Installment', installments[0]);
        const payment2 = this.gocardlessService.requestPayment(code, registration.mandate, 'Membership 2nd Installment', installments[1], '2019-02-01');

        registration.payment1 = await payment1.id;
        registration.payment2 = await payment2.id;

        registration = await this.registrationService.save(registration);

        await this.mandrillService.sendTemplate({
            key: 'gzCgoHgb1Ae7CSdwXDAenA',
            template_name: 'member-direct-debit-details',
            template_content: [
                { name: 'fname', content: registration.fname },
                { name: 'lname', content: registration.lname },
                { name: 'charge', content: moment(payment1.date).format('dddd, Do MMMM YYYY') },
                { name: 'ione', content: `${this.registrationService.getInstallments(code)[0]}.00` },
                { name: 'itwo', content: `${this.registrationService.getInstallments(code)[1]}.00` },
            ],
            message: {
                to: [
                    { email: registration.email, type: 'to' },
                    { email: 'mail@jared.ph', type: 'bcc' },
                ],
            },
        });

        return {
            status: 'OK',
            id: registration.id,
        };
    }
}
