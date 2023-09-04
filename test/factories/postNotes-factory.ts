import { PrismaClient } from "@prisma/client";
import Cryptr from "cryptr";

export class PostNotes {
    private prisma: PrismaClient;
    private cryptr: Cryptr

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        const Cryptr = require('cryptr')
        this.cryptr = new Cryptr("Projeto23-drivenpass")
    }

    async postNotes(text: string, title: string,userId:number) {
        return await this.prisma.note.create({
            data:{title, text, userId}})
    }
}