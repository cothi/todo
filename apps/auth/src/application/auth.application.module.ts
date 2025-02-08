import { BasicLoginHandler } from '@auth/application/commands/handlers/basic-login.handler';
import { ReissueTokenHandler } from '@auth/application/commands/handlers/reissue-token.handler';
import { TokenService } from '@auth/application/services/token.service';
import { UserCredentialService } from '@auth/application/services/user-credential.service';
import { AuthInfrastructureModule } from '@auth/infrastructure/auth.infrastructure.module';
import { JwtTokenModule } from '@libs/jwt';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreUserCredentialHandler } from './commands/handlers/store-user-credential.handler';
import { DeleteUserCredentialHandler } from './commands/handlers/delete-user-credential.handler';
import { UpdateUserCredentialHandler } from './commands/handlers/update-user-credential.handler';

@Module({
  imports: [CqrsModule, JwtTokenModule, AuthInfrastructureModule],
  providers: [
    BasicLoginHandler,
    ReissueTokenHandler,
    StoreUserCredentialHandler,
    DeleteUserCredentialHandler,
    UpdateUserCredentialHandler,
    UserCredentialService,
    TokenService,
  ],
  exports: [],
})
export class AuthApplicationModule {}
