import { PrismaClient } from "@prisma/client";

export class SignupFactory {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createSignup(email: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        password
      }
    })
  }
}