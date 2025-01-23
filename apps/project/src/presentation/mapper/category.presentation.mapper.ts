import { Category } from '@project/domain/entity/category.entity';
import { CategoryType } from '@project/presentation/resolver/type/category.type';
import { TaskPresentationMapper } from '@project/presentation/mapper/task.presentation.mapper';
import {
  CreateCategoryInput,
  DeleteCategoryInput,
} from '@project/presentation/resolver/input/category.input';
import { CreateCategoryCommand } from '@project/application/command/category/create-category.command';
import {
  CreateCategoryOutput,
  DeleteCategoryOutput,
} from '@project/presentation/resolver/output/category.output';
import { DeleteCategoryCommand } from '@project/application/command/category/delete-category.command';

export class CategoryPresentationMapper {
  static entityToObjectType(entity: Category): CategoryType {
    const tasksType = TaskPresentationMapper.entitiesToObjectType(entity.tasks);
    return {
      createdAt: entity.createdAt,
      name: entity.name,
      tasks: tasksType,
      projectId: entity.projectId,
      updatedAt: entity.updatedAt,
      id: entity.id,
    };
  }

  static entitiesToObjectType(entities: Category[]): CategoryType[] {
    return entities.map(entity => this.entityToObjectType(entity));
  }

  static createCategoryInputToCreateCategoryCommand(
    input: CreateCategoryInput,
  ): CreateCategoryCommand {
    return new CreateCategoryCommand(input.projectId, input.name);
  }
  static deleteCategoryInputToDeleteCategoryCommand(
    input: DeleteCategoryInput,
    userId: string,
  ): DeleteCategoryCommand {
    return new DeleteCategoryCommand(input.categoryId, userId);
  }

  static entityToCreateCategoryOutput(entity: Category): CreateCategoryOutput {
    return {
      name: entity.name,
      projectId: entity.projectId,
      updatedAt: entity.updatedAt,
      id: entity.id,
      createdAt: entity.createdAt,
    };
  }
  static entityToDeleteCategoryOutput(entity: Category): DeleteCategoryOutput {
    return {
      id: entity.id,
    };
  }
}
