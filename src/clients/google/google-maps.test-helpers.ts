export class GoogleMapsService {
    getDrivingTime() {}
    getTransitTime() {}
    getMap() {}
}

export const mockGoogleMapResult = {
    destination_addresses: [
        '168 Emscote Rd, Warwick CV34 5QN, UK',
    ],
    origin_addresses: [
        'Lymington Rd, London NW6 1HZ, UK',
    ],
    rows: [
        {
            elements: [
                {
                    distance: {
                        text: '94.4 mi',
                        value: 151970,
                    },
                    duration: {
                        text: '1 hour 44 mins',
                        value: 6266,
                    },
                    status: 'OK',
                },
            ],
        },
    ],
    status: 'OK',
};

export const mockGoogleMapWithTrafficResult = {
    destination_addresses: [
        '168 Emscote Rd, Warwick CV34 5QN, UK',
    ],
    origin_addresses: [
        'Lymington Rd, London NW6 1HZ, UK',
    ],
    rows: [
        {
            elements: [
                {
                    distance: {
                        text: '94.4 mi',
                        value: 151970,
                    },
                    duration_in_traffic: {
                        text: '52 mins',
                        value: 3133,
                    },
                    duration: {
                        text: '1 hour 44 mins',
                        value: 6266,
                    },
                    status: 'OK',
                },
            ],
        },
    ],
    status: 'OK',
};

export const mockGoogleMapwithZeroResult = {
    destination_addresses: [
        '168 Emscote Rd, Warwick CV34 5QN, UK',
    ],
    origin_addresses: [
        'Lymington Rd, London NW6 1HZ, UK',
    ],
    rows: [
        {
            elements: [
                {
                    status: 'ZERO_RESULTS',
                },
            ],
        },
    ],
    status: 'OK',
};
