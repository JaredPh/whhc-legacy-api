import { Component } from '@nestjs/common';
import * as request from 'superagent';
import { MandrillSendRequest } from './mandrill.interfaces';

@Component()
export class MandrillService {

    constructor() {}

    public sendTemplate(body: MandrillSendRequest): Promise<any> {
        return new Promise((resolve) => {

            request
                .post('https://mandrillapp.com/api/1.0/messages/send-template.json')
                .send(body)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    resolve(res.body);
                });
        });
    }
}
