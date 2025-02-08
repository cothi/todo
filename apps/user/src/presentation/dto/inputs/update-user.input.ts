import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class BaseUserInput {
  @Field(() => String)
  nickname: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;
}

@InputType()
export class UpdateUserInput extends PartialType(BaseUserInput) {}
