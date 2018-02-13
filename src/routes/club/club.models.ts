import { Club } from './club.entity';

export class ClubResult {
    id: number;
    name: string;

    constructor(data: Club, full: boolean = false) {
        this.id = data.id;
        this.name = data.name;

        if (full) {
            // TODO: add full mode to club result
        }
    }
}