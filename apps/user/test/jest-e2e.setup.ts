import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '..', '..', '..', '.env.test') });
process.env.NODE_ENV = 'test';
process.env.AUTH_GRPC_URL = 'localhost:50051';
process.env.JWT_SECRET = 'localhost:50051';
process.env.JWT_ACCESS_EXPIRATION_TIME = '1h';
process.env.JWT_REFRESH_EXPIRATION_TIME = '1h';
