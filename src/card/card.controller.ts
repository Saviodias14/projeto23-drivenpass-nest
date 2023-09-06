import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client'
import { CreateCardDto } from './dto/createCardDto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token invalid' })
@UseGuards(AuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @ApiOperation({ description: 'Register a new card' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Card created' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Already exist a card with this title' })
  @Post()
  create(@Body() createCredentialDto: CreateCardDto, @User() user: UserPrisma) {
    return this.cardService.create(createCredentialDto, user.id);
  }

  @ApiOperation({ description: `Gets all user's cards` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @Get()
  findAll(@User() user: UserPrisma) {
    return this.cardService.findAll(user.id);
  }

  @ApiOperation({ description: `Gets user's card by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This card is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This card dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'card id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if (isNaN(newId) || newId < 0) throw new BadRequestException('Id must be a positive number!')
    return this.cardService.findOne(newId, user.id);
  }

  @ApiOperation({ description: `Delete user's card by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It was deleted' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This card is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This card dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'card id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if (isNaN(newId) || newId < 0) throw new BadRequestException('Id must be a positive number!')
    return this.cardService.remove(newId, user.id);
  }
}
