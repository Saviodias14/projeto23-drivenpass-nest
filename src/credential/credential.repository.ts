import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";

@Injectable()
export class CredentialRepository {

    constructor(private readonly prisma: PrismaService) { }

    create(data: CreateCredentialDto, userId: number) {
        return this.prisma.credential.create({
            data: { ...data, userId }
        })
    }

    findAll(userId: number) {
        return this.prisma.credential.findMany({ where: { userId } });
    }

    findOne(id: number) {
        return this.prisma.credential.findUnique({ where: { id } })
    }

    remove(id: number) {
        return this.prisma.credential.delete({ where: { id } })
    }
    findTitle(title: string, userId: number) {
        return this.prisma.credential.findFirst({ where: { title, userId } })
    }
}
