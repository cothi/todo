import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '@auth/infrastructure/auth.infrastructure.module';
import { AuthPresentationModule } from '@auth/presentation/auth.presentaion.module';
import { JwtTokenModule } from '@libs/jwt';
import { AuthApplicationModule } from '@auth/application/auth.application.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

/**
 * TODO
 * @task implement importing the module written so far
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    JwtTokenModule,
    AuthPresentationModule,
  ],
  providers: [],
  exports: [],
})
export class AuthModule {}
