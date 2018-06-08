import { Location } from './locations.entity';

export class LocationResult {
    id: number;
    heading: string;
    address: string;
    home: boolean;

    map?: any;
    transport?: any;

    constructor(data: Location) {
        this.id = data.id;
        this.heading = data.heading;
        this.address = data.address;
        this.home = data.home;
    }

    public setMap(map: any) {
        this.map = map;
    }

    // public setTransport(driving: any, transit: any) {
    //     this.transport = {
    //         driving,
    //         transit,
    //     };
    // }
}
