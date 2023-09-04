import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'

export class SignupFactory {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createSignup(email: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10)
      }
    })
  }
}