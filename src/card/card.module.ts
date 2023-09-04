import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { UserModule } from '../user/user.module';
import { CardRepository } from './card.repository';

@Module({
  imports: [UserModule],
  controllers: [CardController],
  providers: [CardService, CardRepository],
})
export class CardModule {}