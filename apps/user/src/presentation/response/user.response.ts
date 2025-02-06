import { ApiResponseOf } from '@libs/response';
import { ObjectType } from '@nestjs/graphql';
import { CreateUserOutput } from '../dto/output/create-user.output';
import { UpdateUserOutput } from '../dto/output/update-user.output';
import { DeleteUserOutput } from '../dto/output/delete-user.output';

@ObjectType()
export class CreateUserResponse extends ApiResponseOf(CreateUserOutput) {}

@ObjectType()
export class UpdateUserResponse extends ApiResponseOf(UpdateUserOutput) {}

@ObjectType()
export class DeleteUserResponse extends ApiResponseOf(DeleteUserOutput) {}
