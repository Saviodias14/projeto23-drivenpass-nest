import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { EraseRepository } from './erase.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [EraseController],
  providers: [EraseService, EraseRepository]
})
export class EraseModule {}
