export class LocationDrivingResult {
    distance: number;
    time: number;
    traffic?: number;
}

export class LocationTransitResult {
    time: number;
}

export class LocationTransportResult {
    driving: LocationDrivingResult;
    transit: LocationTransitResult;
}

export class LocationsTransportResponse {
    results: LocationTransportResult[];
}
