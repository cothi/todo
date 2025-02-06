import { TokenInfo } from '@libs/decorators';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';
import { ResponseManager } from '@libs/response';
import { UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '@user/presentation/dto/inputs/create-user.input';
import { UpdateUserInput } from '@user/presentation/dto/inputs/update-user.input';
import { UserPresentationMapper } from '@user/presentation/mapper/user-presentation.mapper';
import {
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserResponse,
} from '../response/user.response';

@Resolver()
export class UserResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Query(() => String)
  async healthCheck() {
    return 'OK';
  }

  @Mutation(() => CreateUserResponse)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    const command = UserPresentationMapper.toCreateUserCommand(input);
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToCreateUserOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => UpdateUserResponse)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<UpdateUserResponse> {
    const command = UserPresentationMapper.toUpdateUserCommand(
      payload.userId,
      input,
    );
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToUpdateUserOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => DeleteUserResponse)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @TokenInfo() payload: JwtPayload,
  ): Promise<DeleteUserResponse> {
    const command = UserPresentationMapper.toDeleteUserCommand(payload.userId);
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToDeleteUserOutput(result);
    return ResponseManager.success(output);
  }
}
