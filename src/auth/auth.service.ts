import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignUpDTO } from './dto/signUpDto';
import { SignInDTO } from './dto/signInDto';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    private EXPIRATION_TIME = '30 days'
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UserService
    ) { }

    async signUp(signUpDto: SignUpDTO) {
        const { email } = signUpDto
        const user = await this.usersService.getUserByEmail(email)
        if (user) throw new ConflictException('Email already in use!')
        this.usersService.signUp(signUpDto)
    }

    async signIn(signInDto: SignInDTO) {
        const { email, password } = signInDto

        const user = await this.usersService.getUserByEmail(email)
        if (!user) throw new UnauthorizedException('Email or password not valid!')

        const valid = bcrypt.compare(password, user.password)
        if (!valid) throw new UnauthorizedException('Email or password not valid!')
        return this.createToken(user)
    }

    createToken(user: User){
        const { id, email } = user

        const token = this.jwtService.sign({ email }, {
            expiresIn: this.EXPIRATION_TIME,
            subject: String(id)
          });
      
          return { token }
    }
}
