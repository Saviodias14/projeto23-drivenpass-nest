import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EraseRepository {
    constructor(private readonly prisma: PrismaService) { }
    async delete(userId: number) {
        await this.prisma.card.deleteMany({ where: { userId } })
        await this.prisma.credential.deleteMany({ where: { userId } })
        await this.prisma.note.deleteMany({ where: { userId } })
        await this.prisma.user.deleteMany({ where: { id: userId } })
    }
}