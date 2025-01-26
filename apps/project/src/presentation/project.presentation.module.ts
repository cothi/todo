import { Module } from '@nestjs/common';
import { ProjectResolver } from '@project/presentation/resolver/project.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryResolver } from '@project/presentation/resolver/category.resolver';
import { ProjectApplicationModule } from '@project/application/project.application.module';
import { TaskResolver } from './resolver/task.resolver';

@Module({
  imports: [CqrsModule, ProjectApplicationModule],
  providers: [ProjectResolver, CategoryResolver, TaskResolver],
  exports: [ProjectResolver, CategoryResolver, TaskResolver],
})
export class ProjectPresentationModule {}
