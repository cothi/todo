import { Module } from '@nestjs/common';
import { BasicAuthResolver } from '@auth/presentation/resolver/basic-auth.resolver';
import { TokenResolver } from '@auth/presentation/resolver/token.resolver';
import { AuthGrpcController } from '@auth/presentation/controller/grpc/auth-grpc.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthApplicationModule } from '@auth/application/auth.application.module';

@Module({
  imports: [CqrsModule, AuthApplicationModule],
  providers: [BasicAuthResolver, TokenResolver],
  controllers: [AuthGrpcController],
  exports: [BasicAuthResolver, TokenResolver],
})
export class AuthPresentationModule {}
