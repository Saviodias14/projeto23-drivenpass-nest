import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'

export class SignInFactory {
    private prisma: PrismaClient;
    private jwtService: JwtService

    constructor(prisma: PrismaClient, jwtService: JwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService
    }

    async getToken(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new UnauthorizedException('Email or password not valid!')
        const token = this.jwtService.sign({ email }, {
            subject: String(user.id),
            secret:'ExisteumgrandeclubenacidadeQuemoradentrodomeucoraçãoEuvivocheiodevaidadePoisnarealidadeéumgrandecampeão'
          });
      
          return { token }
    }
}