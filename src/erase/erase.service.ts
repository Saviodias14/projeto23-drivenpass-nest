import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EraseRepository } from './erase.repository';
import { DeleteDto } from './dto/deleteDto';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';

@Injectable()
export class EraseService {
    constructor(
        private readonly eraseRepository: EraseRepository,
        private readonly usersService: UserService){}

    async delete(deleteDto:DeleteDto, userId: number){
        const user = await this.usersService.getUserById(userId)
        console.log(user)
        if(!user) throw new NotFoundException('User not found!')
        const valid = await bcrypt.compare(deleteDto.password, user.password)
        if (!valid) throw new UnauthorizedException('Email or password not valid!')
        return await this.eraseRepository.delete(userId)
    }
}
