import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
 @IsEmail({}, { message: 'Invalid email address' })
    email: string;
  
    @MinLength(1, { message: 'Password is required' })
    password: string;
}