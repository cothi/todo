import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseOf } from '@libs/response';

@ObjectType()
export class ReissueTokenOutput {
  @Field()
  accessToken: string;
}

@ObjectType()
export class ApiResponseOfReissueTokenOutput extends ApiResponseOf(
  ReissueTokenOutput,
) {}
