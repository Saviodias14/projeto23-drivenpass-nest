import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class SignUpDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsStrongPassword({minLength:10})
    @IsNotEmpty()
    password: string
}