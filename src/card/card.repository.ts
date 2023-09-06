import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/createCardDto";

@Injectable()
export class CardRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: CreateCardDto, expiration: Date, userId: number) {
        return this.prisma.card.create({
            data: { ...data, userId, expiration }
        })
    }

    findAll(userId: number) {
        return this.prisma.card.findMany({ where: { userId } });
    }

    findOne(id: number) {
        return this.prisma.card.findUnique({ where: { id } })
    }

    remove(id: number) {
        return this.prisma.card.delete({ where: { id } })
    }

    findTitle(title: string, userId: number) {
        return this.prisma.card.findFirst({ where: { title, userId } })
    }
}