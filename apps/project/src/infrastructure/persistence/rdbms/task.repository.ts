import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '@project/application/port/out/task-repository.port';
import { Task } from '@project/domain/entity/task.entity';
import { TaskInfraMapper } from '@project/infrastructure/mapper/task.infrastructure.mapper';
import { ProjectPrismaService } from '@project/infrastructure/prisma/project-prisma.service';

@Injectable()
export class TaskRepositoryImpl implements ITaskRepository {
  constructor(private readonly prisma: ProjectPrismaService) {}
  async storeTask(entity: Task): Promise<void> {
    const data = TaskInfraMapper.toPersistence(entity);
    await this.prisma.task.create({ data });
  }

  async updateTask(entity: Task): Promise<void> {
    const data = TaskInfraMapper.toPersistence(entity);
    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  async deleteTaskById(taskId: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  async queryTaskByCategoryId(categoryId: string): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      where: {
        categoryId,
      },
    });
    return TaskInfraMapper.tasksToDomain(records);
  }

  async queryTaskByTaskId(taskId: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!record) {
      return null;
    }

    return TaskInfraMapper.taskToDomain(record);
  }
}
