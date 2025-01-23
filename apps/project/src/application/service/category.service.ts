import {
  CategoryRepositorySymbol,
  ICategoryRepository,
} from '@project/application/port/out/category-repository.port';
import {
  CreateCategoryParams,
  DeleteCategoryParams,
} from '@project/application/param/category.params';
import { Category } from '@project/domain/entity/category.entity';
import { Inject } from '@nestjs/common';
import { CategoryPolicyLogic } from '@project/domain/logic/category-policy.logic';
import { ErrorCode, errorFactory } from '@libs/exception';

export class CategoryService {
  constructor(
    @Inject(CategoryRepositorySymbol)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async createCategory(params: CreateCategoryParams): Promise<Category> {
    const entity = Category.create({
      projectId: params.projectId,
      name: params.name,
    });
    await this.categoryRepo.storeCategory(entity);
    return entity;
  }

  async deleteCategory(params: DeleteCategoryParams): Promise<Category> {
    CategoryPolicyLogic.canDeleteCategory(params.project, params.requestUserId);

    const category = await this.categoryRepo.findCategoryById(params.id);

    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    await this.categoryRepo.deleteCategoryById(params.id);
    return category;
  }
}
