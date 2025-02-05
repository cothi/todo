import {
  Category,
  CategoryProps,
} from '@project/domain/entity/category.entity';
import { Project } from '@project/domain/entity/project.entity';

export type CreateCategoryParams = Pick<Category, 'name' | 'projectId'> & {
  project: Project;
  reqUserId: string;
};

export type DeleteCategoryParams = Pick<Category, 'id'> & {
  project: Project;
  reqUserId: string;
};

export type ChangeCategoryNameParams = Pick<Category, 'id' | 'name'> & {
  project: Project;
  reqUserId: string;
};

export type QueryCategoryByIdParams = Pick<Category, 'id'> & {
  reqUserId: string;
};
