export interface GocardlessCustomer {
    email: string;
    given_name: string;
    family_name: string;
}

export interface GocardlessRedirectFlowRequest {
    redirect_flows: {
        session_token: string;
        success_redirect_url: string;
        description: string;
        prefilled_customer: GocardlessCustomer;
    }
}

export interface GocardlessRedirectFlowConfrimRequest {
    data: {
        session_token: string;
    };
}

export interface GocardlessPaymentRequest {
    payments: {
        amount: number;
        currency: string;
        charge_date?: string;
        description: string;
        links: {
            mandate: string;
        };
        metadata: {
            code: string;
        };
    };
}
