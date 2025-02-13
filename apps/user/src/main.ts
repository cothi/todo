import { NestFactory } from '@nestjs/core';
import { UserModule } from '@user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  console.log(process.env.DATABASE_USER_URL);
  await app.listen(3001, '0.0.0.0');
}
bootstrap();
