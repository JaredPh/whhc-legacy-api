export interface GoogleDistanceRequest {
    destinations: string;
    key: string;
    language: string;
    mode: string;
    origins: string;
    units: string;

    arrival_time?: number;
    departure_time?: number;
    traffic_model?: string;
}
