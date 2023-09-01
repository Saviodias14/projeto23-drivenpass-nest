import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CredentialModule } from './credential/credential.module';
import { NoteModule } from './note/note.module';
import { CardModule } from './card/card.module';
import { EraseModule } from './erase/erase.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, CredentialModule, NoteModule, CardModule, EraseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
