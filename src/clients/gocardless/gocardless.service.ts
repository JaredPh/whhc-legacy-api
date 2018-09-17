import { Component } from '@nestjs/common';
import * as request from 'superagent';
import { Registration } from '../../routes/registrations/registrations.entity';
import {
    GocardlessPaymentRequest, GocardlessRedirectFlowConfrimRequest,
    GocardlessRedirectFlowRequest,
} from './gocardless.interfaces';
import { GocardlessRedirectConfirmResult, GocardlessRedirectResult } from './gocardless.models';
import { EncryptionService } from '../../utils/encryption/encryption.service';

@Component()
export class GocardlessService {

    constructor() {}

    public generateRedirect(registration: Registration): Promise<GocardlessRedirectResult> {
        return new Promise((resolve) => {

            const body: GocardlessRedirectFlowRequest = {
                redirect_flows: {
                    session_token: EncryptionService.encrypt(registration.id.toString()),
                    success_redirect_url: 'https://whhc.uk/register/return',
                    description: 'WHHC 2 installment membership', // todo: paramatise type;
                    prefilled_customer: {
                        given_name: registration.fname,
                        family_name: registration.lname,
                        email: registration.email,
                    },
                },
            };

            request
                .post('https://api.gocardless.com/redirect_flows')
                .send(body)
                .set('GoCardless-Version', '2015-07-06')
                .set('Authorization', `Bearer ${process.env.GOCARDLESS_KEY}`) // todo: hide
                .set('Content-Type', 'application/json')
                .set('Idempotency-Key', `whhc${registration.id}`)
                .end((err, res) => {
                    resolve(new GocardlessRedirectResult(res.body));
                });
        });
    }

    public completeRedirect(id: string, token: string): Promise<any> {
        return new Promise((resolve) => {

            const body: GocardlessRedirectFlowConfrimRequest = {
                data: {
                    session_token: token,
                },
            };

            request
                .post(`https://api.gocardless.com/redirect_flows/${id}/actions/complete`)
                .send(body)
                .set('GoCardless-Version', '2015-07-06')
                .set('Authorization', `Bearer ${process.env.GOCARDLESS_KEY}`) // todo: hide
                .set('Content-Type', 'application/json')
                .set('Idempotency-Key', `whhc${id}`)
                .end((err, res) => {
                    resolve(new GocardlessRedirectConfirmResult(res.body));
                });
        });
    }

    public requestPayment(code: string, mandate: string, description: string, amount: number, date?: string): Promise<any> {
        return new Promise((resolve) => {

            const body: GocardlessPaymentRequest = {
                payments: {
                    description,
                    amount: amount * 100,
                    currency: 'GBP',
                    links: { mandate },
                    metadata: { code },
                },
            };

            if (date) {
                body.payments.charge_date = date;
            }

            request
                .post(`https://api.gocardless.com/payments`)
                .send(body)
                .set('GoCardless-Version', '2015-07-06')
                .set('Authorization', `Bearer ${process.env.GOCARDLESS_KEY}`) // todo: hide
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    resolve({
                        id: res.body.payments.id,
                        date: res.body.payments.charge_date,
                    });
                });
        });
    }
}
