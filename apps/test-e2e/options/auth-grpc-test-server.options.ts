import { AUTH_PACKAGE_NAME } from '@libs/grpc';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const authGrpcTestServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: AUTH_PACKAGE_NAME,
    protoPath: join(__dirname, '../../../proto/auth.proto'),
    url: '0.0.0.0:50052',
  },
};
