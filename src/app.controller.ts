import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({description:'Verify if the API is on'})
  @ApiResponse({status:HttpStatus.OK, description:'Api is on'})
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
