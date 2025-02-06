import { Injectable } from '@nestjs/common';
import {
  DeleteUserArgs,
  FindUserByIdArgs,
  IUserRepository,
} from '@user/application/port/out/user-repository.port';
import { UserMapper } from '@user/infrastructure/mapper/user.mapper';
import { User } from '@user/domain/entity/user.entity';
import { UserPrismaService } from '@user/infrastructure/prisma/user-prisma.service';

// 유저 생성, 삭제, 조회, 업데이트
@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: UserPrismaService) {}

  async createUser(args: User): Promise<void> {
    const data = UserMapper.toPersistence(args);
    await this.prisma.users.create({ data });
  }
  async updateUser(args: User): Promise<void> {
    const data = UserMapper.toPersistence(args);
    await this.prisma.users.update({
      where: { id: args.id },
      data,
    });
  }
  async deleteUser(args: DeleteUserArgs): Promise<void> {
    await this.prisma.users.delete({
      where: { id: args.id },
    });
  }

  async findUser(args: FindUserByIdArgs): Promise<User | null> {
    const user = await this.prisma.users.findUnique({ where: { id: args.id } });
    if (!user) {
      return null;
    }
    return UserMapper.toDomain({
      id: user.id,
      email: user.email,
      birthday: user.birthday ?? undefined,
      password: user.password,
      nickname: user.nickname,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    });
  }
}
