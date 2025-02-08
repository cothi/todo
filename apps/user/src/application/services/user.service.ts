import { Inject, Injectable } from '@nestjs/common';
import { ErrorCode, errorFactory } from '@libs/exception';
import {
  IUserRepository,
  UserRepositorySymbol,
} from '@user/application/port/out/user-repository.port';
import { CreateUserParam } from '@user/application/dto/params/create-user.param';
import { User } from '@user/domain/entity/user.entity';
import { UpdateUserParam } from '@user/application/dto/params/update-user.param';
import { DeleteUserParam } from '@user/application/dto/params/delete-user.param';
import { USER_GRPC_SERVICE_SYMBOL } from '@user/infrastructure/adapter/grpc/options/user-grpc-client.options';
import { firstValueFrom } from 'rxjs';
import { AuthMicroservice } from '@libs/grpc';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: IUserRepository,
    @Inject(USER_GRPC_SERVICE_SYMBOL)
    private readonly authClient: AuthMicroservice.AuthServiceClient,
  ) {}

  async createUser(param: CreateUserParam): Promise<User> {
    const user = User.create({
      nickname: param.nickname,
      email: param.email,
      password: param.password,
      birthday: param.birthday,
    });
    await this.userRepository.createUser(user);
    const response = await firstValueFrom(
      this.authClient.storeUserCredential({
        email: user.email,
        userId: user.id,
        passwordHash: user.password,
      }),
    );
    if (!response.success) {
      await this.userRepository.deleteUser(user);
      throw errorFactory(ErrorCode.BAD_REQUEST);
    }
    return user;
  }

  async deleteUser(param: DeleteUserParam): Promise<User> {
    const user = await this.userRepository.findUser({ id: param.id });
    if (!user) {
      throw errorFactory(ErrorCode.USER_NOT_FOUND);
    }
    await this.userRepository.deleteUser({
      id: user.id,
    });
    return user;
  }
  async updateUser(param: UpdateUserParam): Promise<User> {
    const user = await this.userRepository.findUser({ id: param.id });
    if (!user) {
      throw errorFactory(ErrorCode.USER_NOT_FOUND);
    }
    user.changeProfile({
      birthday: param.birthday,
      email: param.email,
      nickname: param.nickname,
    });
    await this.userRepository.updateUser(user);
    return user;
  }
}
