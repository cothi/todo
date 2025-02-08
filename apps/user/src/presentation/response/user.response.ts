import { ApiResponseOf } from '@libs/response';
import { ObjectType } from '@nestjs/graphql';
import {
  CreateUserOutput,
  DeleteUserOutput,
  UpdateUserOutput,
} from '../dto/output/user.output';

@ObjectType()
export class CreateUserResponse extends ApiResponseOf(CreateUserOutput) {}

@ObjectType()
export class UpdateUserResponse extends ApiResponseOf(UpdateUserOutput) {}

@ObjectType()
export class DeleteUserResponse extends ApiResponseOf(DeleteUserOutput) {}
