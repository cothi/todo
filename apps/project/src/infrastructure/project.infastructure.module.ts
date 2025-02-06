import { Module } from '@nestjs/common';
import { CategoryRepositorySymbol } from '@project/application/port/out/category-repository.port';
import { ProjectMembershipRepositorySymbol } from '@project/application/port/out/project-membership-repository.port';
import { ProjectRepositorySymbol } from '@project/application/port/out/project-repository.port';
import { TaskRepositorySymbol } from '@project/application/port/out/task-repository.port';
import { ProjectInvitationRepositorySymbol } from '@project/application/port/project-invitation-repository.port';
import { CategoryRepositoryImpl } from '@project/infrastructure/persistence/rdbms/category.repository';
import { ProjectRepositoryImpl } from '@project/infrastructure/persistence/rdbms/project.repository';
import { ProjectInvitationRepositoryImpl } from './persistence/rdbms/project-invitation.repository';
import { ProjectMembershipRepositoryImpl } from './persistence/rdbms/project-membership.repository';
import { TaskRepositoryImpl } from './persistence/rdbms/task.repository';
import { ProjectPrismaService } from './prisma/project-prisma.service';

@Module({
  imports: [],
  providers: [
    ProjectPrismaService,
    {
      provide: ProjectRepositorySymbol,
      useClass: ProjectRepositoryImpl,
    },
    {
      provide: CategoryRepositorySymbol,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: TaskRepositorySymbol,
      useClass: TaskRepositoryImpl,
    },
    {
      provide: ProjectInvitationRepositorySymbol,
      useClass: ProjectInvitationRepositoryImpl,
    },
    {
      provide: ProjectMembershipRepositorySymbol,
      useClass: ProjectMembershipRepositoryImpl,
    },
  ],
  exports: [
    ProjectRepositorySymbol,
    CategoryRepositorySymbol,
    TaskRepositorySymbol,
    ProjectInvitationRepositorySymbol,
    ProjectMembershipRepositorySymbol,
  ],
})
export class ProjectInfrastructureModule {}
