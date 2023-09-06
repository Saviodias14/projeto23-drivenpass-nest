import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class CreateCredentialDto {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty({example:'https://myurl.com', description:'Credential url'})
    url: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Credential1', description:'Credential title'})
    title: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'MyUsername', description:'Credential username'})
    username: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'password123', description:'Credential password'})
    password: string

}
