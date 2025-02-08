import { AuthMicroservice } from '@libs/grpc';
import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { UserRepositorySymbol } from '@user/application/port/out/user-repository.port';
import {
  USER_GRPC_CLIENT_SYMBOL,
  USER_GRPC_SERVICE_SYMBOL,
} from '@user/infrastructure/adapter/grpc/options/user-grpc-client.options';
import { UserRepositoryImpl } from '@user/infrastructure/persistence/repository/user.repository';
import { UserPrismaService } from './prisma/user-prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_GRPC_CLIENT_SYMBOL,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: './proto/auth.proto',
          url:
            process.env.NODE_ENV === 'test' ? 'localhost:50052' : 'auth:50051',
        },
      },
    ]),
  ],
  providers: [
    UserPrismaService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImpl,
    },
    {
      provide: USER_GRPC_SERVICE_SYMBOL,
      useFactory: (client: ClientGrpc) => {
        return client.getService<AuthMicroservice.AuthServiceClient>(
          AuthMicroservice.AUTH_SERVICE_NAME,
        );
      },
      inject: [USER_GRPC_CLIENT_SYMBOL],
    },
  ],
  exports: [UserRepositorySymbol, USER_GRPC_SERVICE_SYMBOL],
})
export class UserInfrastructureModule {}
