import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';

export enum CategoryMutations {
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
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
          color
        }
      }
    }
  `,

  [CategoryMutations.UPDATE_CATEGORY]: gql`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
      updateCategory(input: $input) {
        status
        success
        message
        data {
          id
          name
          color
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
    query QueryCategory($input: QueryCategoryInput!) {
      queryCategory(input: $input) {
        status
        success
        message
        data {
          id
          name
          projectId
          color
        }
      }
    }
  `,

  [CategoryQueries.QUERY_CATEGORIES]: gql`
    query QueryCategories($input: QueryCategoriesInput!) {
      queryCategories(input: $input) {
        status
        success
        message
        data {
          categories {
            id
            name
            projectId
            color
          }
        }
      }
    }
  `,
};

export interface CreateCategoryInput {
  projectId: string;
  name: string;
  color: string;
}

export class CategoryTestHelper {
  constructor(private readonly graphQLTestHelper: GraphQLTestHelper) {}

  async createCategory(
    variables: { input: CreateCategoryInput },
    accessToken?: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutationWithAuth(
      CategoryMutations.CREATE_CATEGORY,
      variables,
      accessToken,
    );
  }

  async updateCategory(
    variables: { input: { id: string; name?: string; color?: string } },
    accessToken?: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutationWithAuth(
      CategoryMutations.UPDATE_CATEGORY,
      variables,
      accessToken,
    );
  }

  async deleteCategory(
    variables: { input: { id: string } },
    accessToken?: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutationWithAuth(
      CategoryMutations.DELETE_CATEGORY,
      variables,
      accessToken,
    );
  }

  async queryCategory(
    variables: { input: { id: string } },
    accessToken?: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeQueryWithAuth(
      CategoryQueries.QUERY_CATEGORY,
      variables,
      accessToken,
    );
  }

  async queryCategories(
    variables: { input: { projectId: string } },
    accessToken?: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeQueryWithAuth(
      CategoryQueries.QUERY_CATEGORIES,
      variables,
      accessToken,
    );
  }

  private async executeMutationWithAuth<T>(
    mutation: CategoryMutations,
    variables: Record<string, any>,
    accessToken?: string,
  ) {
    const document: DocumentNode = CategoryOperations[mutation];
    const options: any = { variables };

    if (accessToken) {
      options.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return await this.graphQLTestHelper.execute<T>(document, options);
  }

  private async executeQueryWithAuth<T>(
    query: CategoryQueries,
    variables: Record<string, any>,
    accessToken?: string,
  ) {
    const document: DocumentNode = CategoryOperations[query];
    const options: any = { variables };

    if (accessToken) {
      options.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return await this.graphQLTestHelper.execute<T>(document, options);
  }
}
