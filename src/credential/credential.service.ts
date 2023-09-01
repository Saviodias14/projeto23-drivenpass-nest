import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialRepository } from './credential.repository';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialService {
  private cryptr: Cryptr
  constructor(
    private readonly credentialRpository: CredentialRepository
  ) { 
    const Cryptr = require('cryptr')
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET)
  }

  async create(createCredentialDto: CreateCredentialDto, user: User) {
    const findTitle = await this.credentialRpository.findTitle(createCredentialDto.title, user.id)
    if (findTitle) throw new ConflictException('This title already exist!')
    //FIXME:
    
    createCredentialDto.password = this.cryptr.encrypt(createCredentialDto.password)
    return await this.credentialRpository.create(createCredentialDto, user.id)
  }

  async findAll(user:User) {
    return await this.credentialRpository.findAll(user.id);
  }

  async findOne(id: number, user: User) {
    const result = await this.credentialRpository.findOne(id)
    if(!result) throw new NotFoundException('Credential not found!')
    if(result.userId!==user.id) throw new ForbiddenException('This credential is not yours!')
    result.password = this.cryptr.decrypt(result.password)
    return result
  }

  async remove(id: number, user: User) {
    const credential = await this.credentialRpository.findOne(id)
    if(!credential) throw new NotFoundException('Credential not found!')
    if(credential.userId!==user.id) throw new ForbiddenException('This credential is not yours!')
    return await this.credentialRpository.remove(id)
  }
}
