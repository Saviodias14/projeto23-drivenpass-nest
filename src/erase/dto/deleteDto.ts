import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'!2E4s6789', description:'User password'})
    password: string
}