import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialRepository } from './credential.repository';
import { User } from '@prisma/client';
import Cryptr from 'cryptr'

@Injectable()
export class CredentialService {
  constructor(
    private readonly credentialRpository: CredentialRepository
  ) { }

  async create(createCredentialDto: CreateCredentialDto, user: User) {
    const findTitle = await this.credentialRpository.findTitle(createCredentialDto.title, user.id)
    if (findTitle) throw new ConflictException('This title already exist!')

    const cryptr = new Cryptr(createCredentialDto.title)
    console.log(cryptr)
    const cryptoPassword = cryptr.encrypt(createCredentialDto.password)
    createCredentialDto.password = cryptoPassword
    return await this.credentialRpository.create(createCredentialDto, user.id)
  }

  findAll() {
    return `This action returns all credential`;
  }

  findOne(id: number) {
    return `This action returns a #${id} credential`;
  }

  update(id: number, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
