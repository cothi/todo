import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserInput } from '@user/presentation/dto/inputs/update-user.input';
import { TokenInfo } from '@libs/decorators';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';
import { ApiResponseOf, ResponseManager } from '@libs/response';
import { CreateUserInput } from '@user/presentation/dto/inputs/create-user.input';
import { UseGuards } from '@nestjs/common';
import {
  ApiResponseOfCreateUserOutput,
  CreateUserOutput,
} from '@user/presentation/dto/output/create-user.output';
import { UserPresentationMapper } from '@user/presentation/mapper/user-presentation.mapper';
import { ApiResponseOfUpdateUserOutput } from '@user/presentation/dto/output/update-user.output';
import { ApiResponseOfDeleteUserOutput } from '@user/presentation/dto/output/delete-user.output';

@Resolver()
export class UserResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Query(() => String)
  async healthCheck() {
    return 'OK';
  }

  @Mutation(() => ApiResponseOf(CreateUserOutput))
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<ApiResponseOfCreateUserOutput> {
    const command = UserPresentationMapper.toCreateUserCommand(input);
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToCreateUserOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => ApiResponseOfUpdateUserOutput)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<ApiResponseOfUpdateUserOutput> {
    const command = UserPresentationMapper.toUpdateUserCommand(
      payload.userId,
      input,
    );
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToUpdateUserOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => ApiResponseOfDeleteUserOutput)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @TokenInfo() payload: JwtPayload,
  ): Promise<ApiResponseOfDeleteUserOutput> {
    const command = UserPresentationMapper.toDeleteUserCommand(payload.userId);
    const result = await this.commandBus.execute(command);
    const output = UserPresentationMapper.resultToDeleteUserOutput(result);
    return ResponseManager.success(output);
  }
}
