import { Project } from '@project/domain/entity/project.entity';
import { ProjectInfraMapper } from '@project/infrastructure/mapper/project.infrastructure.mapper';
import { IProjectRepository } from '@project/application/port/out/project-repository.port';
import { Injectable } from '@nestjs/common';
import { ProjectPrismaService } from '@project/infrastructure/prisma/project-prisma.service';

@Injectable()
export class ProjectRepositoryImpl implements IProjectRepository {
  constructor(private readonly prisma: ProjectPrismaService) {}
  async createProject(entity: Project): Promise<void> {
    const data = ProjectInfraMapper.createToPersistence(entity);
    await this.prisma.project.create({
      data,
    });
  }

  async findProjectById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: {
          include: {
            tasks: true,
          },
        },
        memberships: true,
        projectInvitations: true,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectInfraMapper.projectToDomain(project);
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          { adminId: userId },
          {
            memberships: { some: { userId: userId } },
          },
        ],
      },
    });

    return ProjectInfraMapper.projectsToDomain(projects);
  }
  async deleteProject(entity: Project): Promise<void> {
    await this.prisma.project.delete({
      where: {
        id: entity.id,
      },
    });
  }
  async updateProject(entity: Project): Promise<void> {
    const data = ProjectInfraMapper.updateToPersistence(entity);
    await this.prisma.project.update({
      where: {
        id: entity.id,
      },
      data,
    });
  }

  async findProjectByCategoryId(categoryId: string): Promise<Project | null> {
    const record = await this.prisma.project.findFirst({
      where: {
        categories: {
          some: { id: categoryId },
        },
      },
      include: {
        categories: {
          include: {
            tasks: true,
          },
        },
      },
    });
    if (!record) {
      return null;
    }

    return ProjectInfraMapper.projectToDomain(record);
  }

  async findProjectByTaskId(taskId: string): Promise<Project | null> {
    const record = await this.prisma.project.findFirst({
      where: {
        categories: {
          some: {
            tasks: {
              some: {
                id: taskId,
              },
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!record) {
      return null;
    }

    return ProjectInfraMapper.projectToDomain(record);
  }
}
