import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { CredentialRepository } from './credential.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CredentialController],
  providers: [CredentialService, CredentialRepository],
})
export class CredentialModule {}
