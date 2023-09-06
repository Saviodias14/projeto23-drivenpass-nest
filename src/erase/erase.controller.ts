import { Body, Controller, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { DeleteDto } from './dto/deleteDto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Erase')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
    constructor(private readonly eraseService: EraseService) { }

    @ApiOperation({ description: 'Register a new credential' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Deleted account' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Password wrong' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This user dont exist' })
    @Delete()
    delete(@Body() DeleteDto: DeleteDto, @User() user: UserPrisma) {
        return this.eraseService.delete(DeleteDto, user.id)
    }
}
