import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, HttpStatus } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token invalid' })
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) { }

  @ApiOperation({ description: 'Register a new credential' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Credential created' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Already exist a credential with this title' })
  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user:UserPrisma) {
    return this.credentialService.create(createCredentialDto, user);
  }

  @ApiOperation({ description: `Gets all user's credential` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @Get()
  findAll(@User() user:UserPrisma) {
    return this.credentialService.findAll(user);
  }

  @ApiOperation({ description: `Gets user's credential by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It is ok' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This credential is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This credential dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'credential id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.credentialService.findOne(newId, user);
  }

  @ApiOperation({ description: `Delete user's credential by id` })
  @ApiResponse({ status: HttpStatus.OK, description: 'It was deleted' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'This credential is not yours' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'This credential dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The id is incorrect' })
  @ApiParam({ name: 'id', description: 'credential id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user:UserPrisma) {
    const newId = parseInt(id)
    if(isNaN(newId)||newId<0)throw new BadRequestException('Id must be a positive number!')
    return this.credentialService.remove(newId, user);
  }
}
