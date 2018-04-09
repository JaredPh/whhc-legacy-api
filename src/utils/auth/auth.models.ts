export class TokenUser {
    id: string;
    email: string;

    constructor(data) {
        this.id = data['cognito:username'];
        this.email = data.email;
    }
}