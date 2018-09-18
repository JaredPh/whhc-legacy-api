import { RegistrationFormBody } from './registrations.interfaces';
import { GocardlessRedirectResult } from '../../clients/gocardless/gocardless.models';

export class RegistrationForm {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    team: string;
    status: string;
    membership: string;
    installments: string;
    date: Date;

    constructor(data: RegistrationFormBody) {
        this.fname = data.about.fname;
        this.lname = data.about.lname;
        this.email = data.about.email;
        this.phone = data.about.phone;

        this.status = data.membership.status;
        this.membership = data.membership.type;

        this.team = data.existing.team;

        this.installments = data.installments.installments;

        this.date = new Date();
    }
}
