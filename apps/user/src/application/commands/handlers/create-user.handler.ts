import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from '@user/application/commands/create-user.command';
import { UserService } from '@user/application/services/user.service';
import { CreateUserParam } from '@user/application/dto/params/create-user.param';
import { User } from '@user/domain/entity/user.entity';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}
  async execute(command: CreateUserCommand): Promise<User> {
    try {
      return await this.userService.createUser(
        new CreateUserParam(
          command.email,
          command.nickname,
          command.password,
          command.birthday,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
