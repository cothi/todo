import { gql } from 'graphql-tag';
import { BaseResponse } from '../graphql.helper';
import { BaseHelper } from './abstract/help.abstract';

export enum CategoryMutations {
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  CHANGE_CATEGORY_NAME = 'CHANGE_CATEGORY_NAME',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
}

export enum CategoryQueries {
  QUERY_CATEGORY = 'QUERY_CATEGORY',
  QUERY_CATEGORIES = 'QUERY_CATEGORIES',
}

export const CategoryOperations = {
  [CategoryMutations.CREATE_CATEGORY]: gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        status
        success
        message
        data {
          id
          name
          projectId
        }
      }
    }
  `,

  [CategoryMutations.CHANGE_CATEGORY_NAME]: gql`
    mutation ChangeCategoryName($input: ChangeCategoryNameInput!) {
      changeCategoryName(input: $input) {
        status
        success
        message
        data {
          id
          name
        }
      }
    }
  `,

  [CategoryMutations.DELETE_CATEGORY]: gql`
    mutation DeleteCategory($input: DeleteCategoryInput!) {
      deleteCategory(input: $input) {
        status
        success
        message
      }
    }
  `,

  [CategoryQueries.QUERY_CATEGORY]: gql`
    query QueryCategoryById($input: QueryCategoryByIdInput!) {
      queryCategoryById(input: $input) {
        status
        success
        message
        data {
          id
          name
          projectId
        }
      }
    }
  `,

  [CategoryQueries.QUERY_CATEGORIES]: gql`
    query QueryCategories {
      queryCategories {
        status
        success
        message
        data {
          categories {
            id
            name
            projectId
          }
        }
      }
    }
  `,
};

export type BaseCategoryVariables = {
  id: string;
  projectId: string;
  name: string;
};

type CreateCategoryVariables = {
  input: Omit<BaseCategoryVariables, 'id'>;
};

type UpdateCategoryVariables = {
  input: Pick<BaseCategoryVariables, 'id' | 'name'>;
};

type DeleteCategoryVariables = {
  input: Pick<BaseCategoryVariables, 'id'>;
};

type QueryCategoryByIdVariables = {
  input: Pick<BaseCategoryVariables, 'id'>;
};

export class CategoryTestHelper extends BaseHelper {
  async createCategory(
    variables: CreateCategoryVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = CategoryOperations[CategoryMutations.CREATE_CATEGORY];
    return await this.execute(document, { variables, accessToken });
  }

  async changeCategoryName(
    variables: UpdateCategoryVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = CategoryOperations[CategoryMutations.CHANGE_CATEGORY_NAME];
    return await this.execute(document, { variables, accessToken });
  }

  async deleteCategory(
    variables: DeleteCategoryVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = CategoryOperations[CategoryMutations.DELETE_CATEGORY];
    return await this.execute(document, { variables, accessToken });
  }

  async queryCategory(
    variables: QueryCategoryByIdVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = CategoryOperations[CategoryQueries.QUERY_CATEGORY];
    return await this.execute(document, { variables, accessToken });
  }

  async queryCategories(accessToken: string): Promise<BaseResponse<any>> {
    const document = CategoryOperations[CategoryQueries.QUERY_CATEGORIES];
    return await this.execute(document, { accessToken });
  }
}
