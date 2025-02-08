import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { ApiResponseOf } from '@libs/response';

@ObjectType()
export class BaseUserOutput {
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field(() => Date, { nullable: true })
  birthday?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class UpdateUserOutput extends BaseUserOutput {}

@ObjectType()
export class DeleteUserOutput extends PickType(BaseUserOutput, ['userId']) {}
@ObjectType()
export class CreateUserOutput extends BaseUserOutput {}
