export interface RegistrationResult {
    status: string;
    redirect?: string;
    code?: string;
}

export interface RegistrationsResponse {
    results: RegistrationResult[];
}

export interface RegistrationFormBody {
    about: {
        fname: string;
        lname: string;
        email: string;
        phone: string;
    };
    membership: {
        status: string;
        type: string;
    };
    existing: {
        team: string;
    };
    installments: {
        installments: string;
    };
}
