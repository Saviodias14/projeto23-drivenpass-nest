import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NoteRepository {
    constructor(private readonly prisma: PrismaService) { }

    findTitle(title: string, userId: number) {
        return this.prisma.note.findFirst({
            where: { title, userId }
        })
    }

    create(data: CreateNoteDto, userId: number) {
        return this.prisma.note.create({ data: { ...data, userId } })
    }

    findAll(userId: number) {
        return this.prisma.note.findMany({ where: { userId } })
    }

    findOne(id: number) {
        return this.prisma.note.findUnique({ where: { id } })
    }

    remove(id: number) {
        return this.prisma.note.delete({ where: { id } })
    }
}