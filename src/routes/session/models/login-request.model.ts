import { IsString, IsEmail } from 'class-validator';

export class LoginRequest {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}