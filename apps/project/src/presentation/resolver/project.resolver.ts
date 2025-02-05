import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ResponseManager } from '@libs/response';
import {
  CreateProjectResponse,
  DeleteProjectResponse,
  QueryProjectResponse,
  QueryProjectsResponse,
  UpdateProjectResponse,
} from '@project/presentation/resolver/response/project.response';
import { ProjectPresentationMapper } from '@project/presentation/mapper/project.presentation.mapper';
import { ProjectType } from '@project/presentation/resolver/type/project.type';
import {
  CreateProjectInput,
  DeleteProjectInput,
  QueryProjectInput,
  UpdateProjectInput,
} from '@project/presentation/resolver/input/project.input';
import { TokenInfo } from '@libs/decorators';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';

@Resolver(() => ProjectType)
export class ProjectResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => String)
  async healthCheck() {
    return 'OK';
  }

  @Mutation(() => CreateProjectResponse)
  @UseGuards(JwtAuthGuard)
  async createProject(
    @Args('input') input: CreateProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<CreateProjectResponse> {
    const command = ProjectPresentationMapper.toCreateProjectCommand(
      input,
      payload.userId,
    );
    const result = await this.commandBus.execute(command);
    const output = ProjectPresentationMapper.createProjectToOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => DeleteProjectResponse)
  @UseGuards(JwtAuthGuard)
  async deleteProject(
    @Args('input') input: DeleteProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<DeleteProjectResponse> {
    const command = ProjectPresentationMapper.toDeleteProjectCommand(
      input,
      payload.userId,
    );
    const result = await this.commandBus.execute(command);
    const output = ProjectPresentationMapper.deleteProjectToOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => UpdateProjectResponse)
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Args('input') input: UpdateProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<UpdateProjectResponse> {
    const command = ProjectPresentationMapper.toUpdateProjectCommand(
      input,
      payload.userId,
    );

    const result = await this.commandBus.execute(command);
    const output = ProjectPresentationMapper.updateProjectToOutput(result);
    return ResponseManager.success(output);
  }

  @Query(() => QueryProjectResponse)
  @UseGuards(JwtAuthGuard)
  async queryProject(
    @Args('input') input: QueryProjectInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<QueryProjectResponse> {
    const query = ProjectPresentationMapper.toProjectQuery(
      input,
      payload.userId,
    );
    const result = await this.queryBus.execute(query);
    const output = ProjectPresentationMapper.queryProjectToOutput(result);
    return ResponseManager.success(output);
  }

  @Query(() => QueryProjectsResponse)
  @UseGuards(JwtAuthGuard)
  async queryProjects(
    @TokenInfo() payload: JwtPayload,
  ): Promise<QueryProjectsResponse> {
    const query = ProjectPresentationMapper.toProjectsQuery(payload.userId);
    const result = await this.queryBus.execute(query);
    const output = ProjectPresentationMapper.queryProjectsToOutput(result);
    return ResponseManager.success(output);
  }
}
