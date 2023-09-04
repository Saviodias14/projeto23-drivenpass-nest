import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '@prisma/client';
import { NoteRepository } from './note.repository';

@Injectable()
export class NoteService {
  constructor(private readonly noteRpository: NoteRepository){}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const findTitle = await this.noteRpository.findTitle(createNoteDto.title, user.id)
    if(findTitle) throw new ConflictException('This title already exist!')
    return await this.noteRpository.create(createNoteDto, user.id)
  }

  async findAll(userId: number) {
    return this.noteRpository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const result = await this.noteRpository.findOne(id)
    if(!result) throw new NotFoundException('Note not found!')
    if(result.userId!==userId) throw new ForbiddenException('This note is not yours!')
    return result
  }

  async remove(id: number, userId: number) {
    const note = await this.noteRpository.findOne(id)
    if(!note) throw new NotFoundException('Note not found!')
    if(note.userId!==userId) throw new ForbiddenException('This note is not yours!')
    return await this.noteRpository.remove(id)
  }
}
