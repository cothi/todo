import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseOf } from '@libs/response';

@ObjectType()
export class LoginOutput {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;
}
@ObjectType()
export class ApiResponseOfLoginOutput extends ApiResponseOf(LoginOutput) {}
