export interface MandrillSendRequest {
    key: string;
    template_name: string;
    template_content: {
        name: string;
        content: string;
    }[];
    message: {
        to: {
            email: string;
            type?: string;
        }[];
    };
}

interface MandrillSendResult {
    email: string;
    status: string;
    _id: string;
    reject_reason?: any;
}
