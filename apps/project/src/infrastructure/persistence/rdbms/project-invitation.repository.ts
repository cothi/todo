import { Injectable } from '@nestjs/common';
import { IProjectInvitationRepository } from '@project/application/port/project-invitation-repository.port';
import { ProjectInvitation } from '@project/domain/entity/project-invitation.entity';
import { ProjectInvitationInfraMapper } from '@project/infrastructure/mapper/project-invitation.infrastructure.mapper';
import { ProjectPrismaService } from '@project/infrastructure/prisma/project-prisma.service';

@Injectable()
export class ProjectInvitationRepositoryImpl
  implements IProjectInvitationRepository
{
  constructor(private readonly prisma: ProjectPrismaService) {}
  async storeProjectInvitation(entity: ProjectInvitation): Promise<void> {
    const data = ProjectInvitationInfraMapper.toPersistence(entity);
    await this.prisma.projectInvitation.create({
      data: data,
    });
  }

  async updateProjectInvitation(entity: ProjectInvitation): Promise<void> {
    const data = ProjectInvitationInfraMapper.toPersistence(entity);
    await this.prisma.projectInvitation.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findProjectInvitationById(
    projectInvitationId: string,
  ): Promise<ProjectInvitation | null> {
    const record = await this.prisma.projectInvitation.findUnique({
      where: {
        id: projectInvitationId,
      },
    });

    if (!record) {
      return null;
    }
    return ProjectInvitationInfraMapper.projectInvitationToDomain(record);
  }
}
