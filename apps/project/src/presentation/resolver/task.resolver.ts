import { TokenInfo } from '@libs/decorators';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';
import { ResponseManager } from '@libs/response';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskPresentationMapper } from '../mapper/task.presentation.mapper';
import {
  CreateTaskInput,
  DeleteTaskInput,
  QueryTaskByIdInput,
  QueryTasksByCategoryIdInput,
  UpdateTaskInput,
} from './input/task.input';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  QueryTaskByCategoryIdResponse,
  QueryTaskByIdResponse,
  UpdateTaskResponse,
} from './response/task.response';
import { TaskType } from './type/task.type';

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation(() => CreateTaskResponse)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<CreateTaskResponse> {
    const command = TaskPresentationMapper.createInputToCreateTaskCommand(
      input,
      payload.userId,
    );
    const result = await this.commandBus.execute(command);
    const output = TaskPresentationMapper.entityToCreateTaskOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => UpdateTaskResponse)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<UpdateTaskResponse> {
    const command = TaskPresentationMapper.updateInputToUpdateTaskCommand(
      input,
      payload.userId,
    );
    const result = await this.commandBus.execute(command);
    const output = TaskPresentationMapper.entityToUpdateTaskOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => DeleteTaskResponse)
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Args('input') input: DeleteTaskInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<DeleteTaskResponse> {
    const command = TaskPresentationMapper.deleteInputToDeleteTaskCommand(
      input,
      payload.userId,
    );
    const result = await this.commandBus.execute(command);
    const output = TaskPresentationMapper.entityToDeleteTaskOutput(result);
    return ResponseManager.success(output);
  }

  @Query(() => QueryTaskByIdResponse)
  @UseGuards(JwtAuthGuard)
  async queryTaskById(
    @Args('input') input: QueryTaskByIdInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<QueryTaskByIdResponse> {
    const query = TaskPresentationMapper.queryTaskByIdInputToTaskByIdQuery(
      input,
      payload.userId,
    );
    const result = await this.queryBus.execute(query);
    const output = TaskPresentationMapper.entityToQueryTaskByIdOutput(result);
    return ResponseManager.success(output);
  }

  @Query(() => QueryTaskByCategoryIdResponse)
  async queryTasksByCategoryId(
    @Args('input') input: QueryTasksByCategoryIdInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<QueryTaskByCategoryIdResponse> {
    const query =
      TaskPresentationMapper.queryTasksByCategoryIdToTaskByCategoryIdQuery(
        input,
        payload.userId,
      );
    const result = await this.queryBus.execute(query);
    const output =
      TaskPresentationMapper.entitiesToQueryTasksByCategoryIdOutput(result);
    return ResponseManager.success(output);
  }
}
