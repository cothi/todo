import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const USER_GRPC_CLIENT_SYMBOL = Symbol('USER_GRPC_CLIENT_SYMBOL');
export const USER_GRPC_SERVICE_SYMBOL = 'USER_GRPC_SERVICE_SYMBOL';

export const userGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'auth',
    protoPath: join(__dirname, '../../../proto/auth.proto'),
    url: 'localhost:50051',
  },
};
