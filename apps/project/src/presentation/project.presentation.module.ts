import { Module } from '@nestjs/common';
import { ProjectResolver } from '@project/presentation/resolver/project.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryResolver } from '@project/presentation/resolver/category.resolver';
import { ProjectApplicationModule } from '@project/application/project.application.module';
import { TaskResolver } from './resolver/task.resolver';
import { ProjectInvitationResolver } from './resolver/project-invitation.resolver';
import { JwtTokenModule } from '@libs/jwt';

@Module({
  imports: [JwtTokenModule, CqrsModule, ProjectApplicationModule],
  providers: [
    ProjectResolver,
    CategoryResolver,
    TaskResolver,
    ProjectInvitationResolver,
  ],
  exports: [
    ProjectResolver,
    CategoryResolver,
    TaskResolver,
    ProjectInvitationResolver,
  ],
})
export class ProjectPresentationModule {}
