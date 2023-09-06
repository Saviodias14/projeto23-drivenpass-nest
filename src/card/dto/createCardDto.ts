import { ApiProperty } from "@nestjs/swagger"
import { CardTypes } from "@prisma/client"
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, } from "class-validator"

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Card1', description:`Card's title`})
    title: string
    @IsString()
    @IsNotEmpty()
    @Length(16)
    @ApiProperty({example:'1234567812345678', description:`Card's number`})
    number: string
    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    @ApiProperty({example:'123', description:`Card's security code`})
    cvv: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'User Name', description:`Card's name`})
    name: string
    @IsString()
    @IsNotEmpty()
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    @ApiProperty({example:'01/30', description:`Card's title`})
    expiration: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'123456', description:`Card's password`})
    password: string
    @IsBoolean()
    @IsOptional()
    @ApiProperty({example:true, description:`Card is virtual`})
    virtual?: boolean
    @IsIn([CardTypes.BOTH, CardTypes.CREDIT, CardTypes.DEBIT], {
        message: 'Category must be one of CREDIT, DEBIT, or BOTH',
    })
    @ApiProperty({example:'CREDIT', description:`The type of the card is CREDIT`})
    type: CardTypes
}