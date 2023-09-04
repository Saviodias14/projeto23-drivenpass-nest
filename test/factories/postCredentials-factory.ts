import { PrismaClient } from "@prisma/client";
import Cryptr from "cryptr";

export class PostCredential {
    private prisma: PrismaClient;
    private cryptr: Cryptr

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        const Cryptr = require('cryptr')
        this.cryptr = new Cryptr("Projeto23-drivenpass")
    }

    async postCredential(url: string, title: string, username:string, password: string, userId:number) {
        const newPassword = this.cryptr.encrypt(password)
        return await this.prisma.credential.create({
            data:{url, username, title, password: newPassword, userId}})
    }
}