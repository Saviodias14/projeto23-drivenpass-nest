import { Injectable } from '@nestjs/common';
import { SignInDTO } from '../auth/dto/signInDto';
import { SignUpDTO } from '../auth/dto/signUpDto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async signUp(signUpDto: SignUpDTO){
        return await this.userRepository.createUser(signUpDto)
    }

    async signIn(signInDto: SignInDTO){
        
    }

    async getUserByEmail(email: string){
        return await this.userRepository.getUserByEmail(email)
    }
}
