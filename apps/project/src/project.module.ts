import { LoggerModule } from '@libs/logger';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ProjectPresentationModule } from './presentation/project.presentation.module';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from '@libs/filter';
import { JwtTokenModule } from '@libs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    ProjectPresentationModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
})
export class ProjectModule {}
