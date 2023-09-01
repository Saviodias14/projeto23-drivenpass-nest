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

    findAll() {
        return `This action returns all credential`;
    }

    findOne(id: number) {
        return `This action returns a #${id} credential`;
    }

    remove(id: number) {
        return `This action removes a #${id} credential`;
    }
    findTitle(title: string, userId: number) {
        return this.prisma.credential.findFirst({ where: { title, userId } })
    }
}
