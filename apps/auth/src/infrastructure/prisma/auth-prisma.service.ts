import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient as AuthPrismaClient } from '@prisma/client-auth';

@Injectable()
export class AuthPrismaService
  extends AuthPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleDestroy() {
    await this.$connect();
  }

  async onModuleInit() {
    await this.$disconnect();
  }
}
