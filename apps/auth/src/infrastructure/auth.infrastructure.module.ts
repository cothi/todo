import { Module } from '@nestjs/common';
import { UserCredentialRepositorySymbol } from '@auth/application/port/out/user-credential-repository.port';
import { UserCredentialRepositoryImpl } from '@auth/infrastructure/persistence/user-credential.repository';
import { TokenRepositorySymbol } from '@auth/application/port/out/token-repository.port';
import { TokenRepositoryImpl } from '@auth/infrastructure/persistence/token.repository';
import { AuthPrismaService } from './prisma/auth-prisma.service';

@Module({
  providers: [
    AuthPrismaService,
    {
      provide: UserCredentialRepositorySymbol,
      useClass: UserCredentialRepositoryImpl,
    },
    {
      provide: TokenRepositorySymbol,
      useClass: TokenRepositoryImpl,
    },
  ],
  exports: [UserCredentialRepositorySymbol, TokenRepositorySymbol],
})
export class AuthInfrastructureModule {}
