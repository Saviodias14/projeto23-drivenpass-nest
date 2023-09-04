import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { User } from '../decorators/user.decorator';
import {User as UserPrisma} from '@prisma/client'
import { CreateCardDto } from './dto/createCardDto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body() createCredentialDto: CreateCardDto, @User() user:UserPrisma) {
    return this.cardService.create(createCredentialDto, user.id);
  }

  @Get()
  findAll(@User() user:UserPrisma) {
    return this.cardService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.cardService.findOne(newId, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.cardService.remove(newId, user.id);
  }
}
