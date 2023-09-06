import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, HttpStatus } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token invalid' })
@UseGuards(AuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ description: 'Register a new note' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Note created' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Already exist a note with this title' })
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    return this.noteService.create(createNoteDto, user);
  }

  @ApiOperation({ description: `Gets all user's notes` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @Get()
  findAll(@User() user: UserPrisma) {
    return this.noteService.findAll(user.id);
  }

  @ApiOperation({ description: `Gets user's note by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This note is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This note dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'note id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.noteService.findOne(newId, user.id);
  }

  @ApiOperation({ description: `Delete user's note by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It was deleted' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This note is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This note dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'note id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.noteService.remove(newId, user.id);
  }
}
