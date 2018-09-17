export class GocardlessRedirectResult {
    id: string;
    token: string;
    url: string;

    constructor(data) {
        this.id = data.redirect_flows.id;
        this.token = data.redirect_flows.session_token;
        this.url = data.redirect_flows.redirect_url;
    }
}

export class GocardlessRedirectConfirmResult {
    id: string;
    mandate: string;

    constructor(data) {
        this.id = data.redirect_flows.id;
        this.mandate = data.redirect_flows.links.mandate;
    }
}
