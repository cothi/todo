import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from '@project/application/command/category/delete-category.command';
import { CategoryService } from '@project/application/service/category.service';
import { ProjectService } from '@project/application/service/project.service';
import { Category } from '@project/domain/entity/category.entity';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(
    private readonly projectService: ProjectService,
    private readonly categoryService: CategoryService,
  ) {}
  async execute(command: DeleteCategoryCommand): Promise<Category> {
    const project = await this.projectService.queryProjectByCategoryId({
      categoryId: command.categoryId,
    });
    return await this.categoryService.deleteCategory({
      reqUserId: command.userId,
      project,
      id: command.categoryId,
    });
  }
}
