import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Note1', description:'Note title'})
    title: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Hello world!', description:'Note text'})
    text: string
}
