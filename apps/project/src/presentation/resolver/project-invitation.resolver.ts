import { ResponseManager } from '@libs/response';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProjectInvitationPresentationMapper } from '../mapper/project-invitation.presentation.mapper';
import {
  AcceptProjectInvitationInput,
  CreateProjectInvitationInput,
  RejectProjectInvitationInput,
  UpdateProjectInvitationInput,
} from './input/project-invitation.input';
import {
  AcceptProjectInvitationResponse,
  CreateProjectInvitationResponse,
  RejectProjectInvitationResponse,
  UpdateProjectInvitationResponse,
} from './response/project-invitation.response';
import { ProjectInvitationType } from './type/project-invitation.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtPayload } from '@libs/jwt';
import { TokenInfo } from '@libs/decorators';

@Resolver(() => ProjectInvitationType)
export class ProjectInvitationResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => CreateProjectInvitationResponse)
  @UseGuards(JwtAuthGuard)
  async createProjectInvitation(
    @Args('input') input: CreateProjectInvitationInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<CreateProjectInvitationResponse> {
    const command =
      ProjectInvitationPresentationMapper.createProjectInvitationInputToCommand(
        input,
        payload.userId,
      );
    const result = await this.commandBus.execute(command);
    const output =
      ProjectInvitationPresentationMapper.entityToCreateProjectInvitationOutput(
        result,
      );
    return ResponseManager.success(output);
  }

  @Mutation(() => UpdateProjectInvitationResponse)
  @UseGuards(JwtAuthGuard)
  async updateProjectInvitation(
    @Args('input') input: UpdateProjectInvitationInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<UpdateProjectInvitationResponse> {
    const command =
      ProjectInvitationPresentationMapper.updateProjectInvitationInputToCommand(
        input,
        payload.userId,
      );
    const result = await this.commandBus.execute(command);
    const output =
      ProjectInvitationPresentationMapper.entityToUpdateProjectInvitationOutput(
        result,
      );

    return ResponseManager.success(output);
  }

  @Mutation(() => AcceptProjectInvitationResponse)
  @UseGuards(JwtAuthGuard)
  async acceptProjectInvitation(
    @Args('input') input: AcceptProjectInvitationInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<AcceptProjectInvitationResponse> {
    const command =
      ProjectInvitationPresentationMapper.acceptProjectInvitationInputToCommand(
        input,
        payload.userId,
      );
    const result = await this.commandBus.execute(command);
    const output =
      ProjectInvitationPresentationMapper.entityToAcceptProjectInvitationOutput(
        result,
      );
    return ResponseManager.success(output);
  }

  @Mutation(() => RejectProjectInvitationResponse)
  @UseGuards(JwtAuthGuard)
  async rejectProjectInvitation(
    @Args('input') input: RejectProjectInvitationInput,
    @TokenInfo() payload: JwtPayload,
  ): Promise<RejectProjectInvitationResponse> {
    const command =
      ProjectInvitationPresentationMapper.rejectProjectInvitationInputToCommand(
        input,
        payload.userId,
      );
    const result = await this.commandBus.execute(command);
    const output =
      ProjectInvitationPresentationMapper.entityToRejectProjectInvitationOutput(
        result,
      );
    return ResponseManager.success(output);
  }
}
