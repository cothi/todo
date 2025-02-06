import { ApiResponseOf } from '@libs/response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserOutput {
  @Field()
  userId: string;
}
