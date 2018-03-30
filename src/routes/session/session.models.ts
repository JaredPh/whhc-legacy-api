import { IsString, IsEmail } from 'class-validator';

export class SessionRequest {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}