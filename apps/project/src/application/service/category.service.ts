import {
  ChangeCategoryNameParams,
  CreateCategoryParams,
  DeleteCategoryParams,
  QueryCategoryByIdParams,
} from '@project/application/param/category.params';
import {
  CategoryRepositorySymbol,
  ICategoryRepository,
} from '@project/application/port/out/category-repository.port';

import { ErrorCode, errorFactory } from '@libs/exception';
import { Inject } from '@nestjs/common';
import { Category } from '@project/domain/entity/category.entity';
import { CategoryPolicyLogic } from '@project/domain/logic/category-policy.logic';

export class CategoryService {
  constructor(
    @Inject(CategoryRepositorySymbol)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async createCategory(params: CreateCategoryParams): Promise<Category> {
    CategoryPolicyLogic.canCreateCategory(params.project, params.reqUserId);
    const entity = Category.create({
      projectId: params.projectId,
      name: params.name,
    });
    await this.categoryRepo.storeCategory(entity);
    return entity;
  }

  async deleteCategory(params: DeleteCategoryParams): Promise<Category> {
    CategoryPolicyLogic.canDeleteCategory(params.project, params.reqUserId);

    const category = await this.categoryRepo.findCategoryById(params.id);

    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    await this.categoryRepo.deleteCategoryById(params.id);
    return category;
  }

  async changeName(params: ChangeCategoryNameParams): Promise<Category> {
    const category = await this.categoryRepo.findCategoryById(params.id);
    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }
    CategoryPolicyLogic.changeName(
      params.project,
      category,
      params.reqUserId,
      params.name,
    );
    await this.categoryRepo.updateCategory(category);
    return category;
  }

  async queryCategoryById(params: QueryCategoryByIdParams): Promise<Category> {
    const category = await this.categoryRepo.findCategoryById(params.id);
    if (!category) {
      throw errorFactory(ErrorCode.NOT_FOUND);
    }

    return category;
  }
}
