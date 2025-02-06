import { Injectable } from '@nestjs/common';
import {
  DeleteUserCredentialArgs,
  FindUserCredentialArgs,
  FindUserCredentialByEmailArgs,
  IUserCredentialRepository,
} from '@auth/application/port/out/user-credential-repository.port';
import { UserCredentialMapper } from '@auth/infrastructure/persistence/mapper/user-credential.mapper';
import { UserCredential } from '@auth/domain/entities/user-credential.entity';
import { AuthPrismaService } from '../prisma/auth-prisma.service';

@Injectable()
export class UserCredentialRepositoryImpl implements IUserCredentialRepository {
  constructor(private readonly prisma: AuthPrismaService) {}
  async createUserCredential(entity: UserCredential): Promise<void> {
    const data = UserCredentialMapper.toPersistence(entity);
    await this.prisma.userCredentials.create({ data });
  }
  async updateUserCredential(entity: UserCredential): Promise<void> {
    const record = UserCredentialMapper.toPersistence(entity);
    await this.prisma.userCredentials.update({
      where: {
        id: entity.id,
      },
      data: record,
    });
  }
  async deleteUserCredential(data: DeleteUserCredentialArgs): Promise<void> {
    await this.prisma.userCredentials.delete({
      where: {
        id: data.id,
      },
    });
  }
  async findUserCredentials(
    data: FindUserCredentialArgs,
  ): Promise<UserCredential | null> {
    const record = await this.prisma.userCredentials.findUnique({
      where: {
        userId: data.userId,
      },
    });
    if (!record) {
      return null;
    }
    return UserCredentialMapper.toDomain(record);
  }

  async findUserCredentialsByEmail(
    data: FindUserCredentialByEmailArgs,
  ): Promise<UserCredential | null> {
    const record = await this.prisma.userCredentials.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!record) return null;
    return UserCredentialMapper.toDomain(record);
  }
}
