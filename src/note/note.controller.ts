import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    return this.noteService.create(createNoteDto, user);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.noteService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.noteService.findOne(newId, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.noteService.remove(newId, user.id);
  }
}
