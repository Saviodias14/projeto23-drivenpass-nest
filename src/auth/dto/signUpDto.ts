import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class SignUpDTO{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:'user@gmail.com', description:'Email for user'})
    email: string

    @IsStrongPassword({minLength:10})
    @IsNotEmpty()
    @ApiProperty({example:'!2E4s6789', description:'Password for user'})
    password: string
}