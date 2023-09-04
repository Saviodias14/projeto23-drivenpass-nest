import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { DeleteDto } from './dto/deleteDto';

@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
    constructor(private readonly eraseService: EraseService) { }

    @Delete()
    delete(@Body() DeleteDto: DeleteDto, @User() user: UserPrisma) {
        return this.eraseService.delete(DeleteDto, user.id)
    }
}
