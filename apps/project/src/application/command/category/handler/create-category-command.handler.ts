import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '@project/application/command/category/create-category.command';
import { CategoryService } from '@project/application/service/category.service';
import { ProjectService } from '@project/application/service/project.service';
import { Category } from '@project/domain/entity/category.entity';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly projectService: ProjectService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const project = await this.projectService.queryProject({
      id: command.projectId,
      userId: command.reqUserId,
    });
    return await this.categoryService.createCategory({
      name: command.name,
      project: project,
      reqUserId: command.reqUserId,
      projectId: command.projectId,
    });
  }
}
