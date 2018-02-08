import { IClub } from './Club.interface';

export interface ITeam {
    id: number;
    name: string;
    type: 'mens' | 'ladies';
    club?: IClub;
}