import { CardTypes } from "@prisma/client"
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, } from "class-validator"

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title: string
    @IsString()
    @IsNotEmpty()
    @Length(16)
    number: string
    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    cvv: string
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    expiration: Date
    @IsString()
    @IsNotEmpty()
    password: string
    @IsBoolean()
    @IsOptional()
    virtual?: boolean
    @IsIn([CardTypes.BOTH, CardTypes.CREDIT, CardTypes.DEBIT], {
        message: 'Category must be one of CREDIT, DEBIT, or BOTH',
    })
    type: CardTypes
}