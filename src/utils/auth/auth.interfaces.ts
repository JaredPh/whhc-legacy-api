export interface CognitoEvent {
    type: string;
    cognitoPoolId: string;
    time: string;
}

export interface CognitoParams {
    cognitoUserPoolId: string;
    region: string;
    tokenUse: string;
    tokenExpiration: string;
}