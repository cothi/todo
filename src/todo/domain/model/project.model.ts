import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '@prisma/client';

@ObjectType()
export class ProjectModel implements Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  userId: string;

  @HideField()
  createdAt: Date;

  @HideField()
  updatedAt: Date;
}