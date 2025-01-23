import { Category } from '@project/domain/entity/category.entity';
import { Project } from '@project/domain/entity/project.entity';

export type CreateCategoryParams = Pick<Category, 'name' | 'projectId'>;

export type DeleteCategoryParams = Pick<Category, 'id'> & {
  project: Project;
  requestUserId: string;
};
