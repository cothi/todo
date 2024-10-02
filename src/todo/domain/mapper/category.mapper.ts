import { CategoryModel } from '@/todo/domain/model/category.model';
import { Category, Prisma } from '@prisma/client';

type ProjectWithCategoriesAndTasks = Prisma.CategoryGetPayload<{
  include: {
    tasks: true;
  };
}>;
export class CategoryMapper {
  static toDomain(category: Category): CategoryModel {
    return {
      ...category,
    };
  }

  static toDomains(categories: Category[]): CategoryModel[] {
    return categories.map(category => this.toDomain(category));
  }
  static CategoryTasksToDomain(
    payload: ProjectWithCategoriesAndTasks,
  ): CategoryModel {
    return {
      id: payload.id,
      name: payload.name,
      projectId: payload.projectId,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      tasks: payload.tasks.map(task => ({
        id: task.id,
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        actualStartDate: task.actualStartDate || null,
        actualEndDate: task.actualEndDate || null,
        check: task.check,
        status: task.status,
        categoryId: task.categoryId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    };
  }
}
