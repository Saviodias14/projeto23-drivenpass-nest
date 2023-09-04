import { CardTypes, PrismaClient } from "@prisma/client";
import Cryptr from "cryptr";

export class PostCard {
    private prisma: PrismaClient;
    private cryptr: Cryptr

    constructor(prisma: PrismaClient, cryptr: Cryptr) {
        this.prisma = prisma;
        const Cryptr = require('cryptr')
        this.cryptr = cryptr
    }

    async postCard(userId: number, expiration: Date, title: string, number: string,
        cvv: string, name: string, password: string, type: CardTypes, virtual?: boolean) {
        const newPassword = this.cryptr.encrypt(password)
        const newCvv = this.cryptr.encrypt(cvv)
        return await this.prisma.card.create({
            data: { cvv: newCvv, expiration, name, number, type, virtual, title, password: newPassword, userId }
        })
    }
}