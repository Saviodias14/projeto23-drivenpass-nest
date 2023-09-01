import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDTO } from "../auth/dto/signUpDto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserRepository {
    private SALT = 10
    constructor(private readonly prisma: PrismaService) { }

    createUser(data: SignUpDTO) {
        return this.prisma.user.create({
            data: { ...data, password: bcrypt.hashSync(data.password, this.SALT) }
        })
    }

    getUserByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } })
    }

    getUserById(id: number) {
        return this.prisma.user.findUnique({ where: { id } })
    }
}