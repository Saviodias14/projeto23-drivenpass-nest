import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) { }

  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user:UserPrisma) {
    return this.credentialService.create(createCredentialDto, user);
  }

  @Get()
  findAll(@User() user:UserPrisma) {
    return this.credentialService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.credentialService.findOne(newId, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.credentialService.remove(newId, user);
  }
}
