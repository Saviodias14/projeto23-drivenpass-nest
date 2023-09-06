import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDTO{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:'user@gmail.com', description:'Email for user'})
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'!2E4s6789', description:'Password for user'})
    password: string
}