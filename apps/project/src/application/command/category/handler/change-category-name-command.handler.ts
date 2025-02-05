import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ProjectService } from '@project/application/service/project.service';
import { Category } from '@project/domain/entity/category.entity';
import { CategoryService } from '@project/application/service/category.service';
import { ChangeCategoryNameCommand } from '../change-category-name.command';

@CommandHandler(ChangeCategoryNameCommand)
@Injectable()
export class ChangeCategoryNameHandler
  implements ICommandHandler<ChangeCategoryNameCommand>
{
  constructor(
    private readonly projectService: ProjectService,
    private readonly categoryService: CategoryService,
  ) {}
  async execute(command: ChangeCategoryNameCommand): Promise<Category> {
    const project = await this.projectService.queryProjectByCategoryId({
      categoryId: command.categoryId,
    });
    return await this.categoryService.changeName({
      project: project,
      id: command.categoryId,
      name: command.name,
      reqUserId: command.reqUserId,
    });
  }
}
