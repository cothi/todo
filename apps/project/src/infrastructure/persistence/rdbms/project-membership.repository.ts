import { Injectable } from '@nestjs/common';
import { IProjectMembershipRepository } from '@project/application/port/out/project-membership-repository.port';
import { ProjectMembership } from '@project/domain/entity/project-membership.entity';
import { ProjectMembershipInfraMapper } from '@project/infrastructure/mapper/project-membership.infrastructure';
import { ProjectPrismaService } from '@project/infrastructure/prisma/project-prisma.service';

@Injectable()
export class ProjectMembershipRepositoryImpl
  implements IProjectMembershipRepository
{
  constructor(private readonly prisma: ProjectPrismaService) {}

  async storeProjectMembership(entity: ProjectMembership): Promise<void> {
    const data = ProjectMembershipInfraMapper.toPersistence(entity);
    const record = await this.prisma.projectMembership.create({
      data,
    });
    record.role;
  }
}
