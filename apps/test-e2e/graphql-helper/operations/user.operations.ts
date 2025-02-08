import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';

export enum UserQueries {
  QUERY_USER = 'QUERY_USER',
}

export enum UserMutations {
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

export const UserOperations = {
  [UserQueries.QUERY_USER]: gql`
    query QueryUser($input: QueryUserInput!) {
      queryUser(input: $input) {
        status
        success
        message
        data {
          id
          email
          nickname
          birthday
          createdAt
          updatedAt
        }
      }
    }
  `,

  [UserMutations.CREATE_USER]: gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        status
        success
        message
        data {
          userId
          email
          nickname
        }
      }
    }
  `,

  [UserMutations.UPDATE_USER]: gql`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        status
        success
        message
        data {
          userId
          email
          nickname
        }
      }
    }
  `,

  [UserMutations.DELETE_USER]: gql`
    mutation DeleteUser {
      deleteUser {
        status
        success
        message
        data {
          userId
        }
      }
    }
  `,
};

export interface UserInputBase {
  id: string;
  email: string;
  password: string;
  nickname: string;
  birthday?: string;
}

export interface CreateUserVariables {
  input: Pick<UserInputBase, 'email' | 'password' | 'nickname' | 'birthday'>;
}

export interface UpdateUserVariables {
  input: Partial<Omit<UserInputBase, 'id'>>;
}

// export interface DeleteUserVariables {
//   input: Pick<UserInputBase, 'id'>;
// }

export interface QueryUserVariables {
  input: Pick<UserInputBase, 'id'>;
}

export interface Options {
  accessToken?: string;
  variables?: Record<string, any>;
}

export class UserTestHelper {
  constructor(private readonly graphQLTestHelper: GraphQLTestHelper) {}

  async createUser(variables: CreateUserVariables): Promise<BaseResponse<any>> {
    return await this.executeMutation(UserMutations.CREATE_USER, variables);
  }

  async updateUser(
    variables: UpdateUserVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutationWithToken(
      UserMutations.UPDATE_USER,
      variables,
      accessToken,
    );
  }

  async deleteUser(
    //variables: DeleteUserVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutationOnlyToken(
      UserMutations.DELETE_USER,
      accessToken,
    );
  }

  async queryUser(variables: QueryUserVariables): Promise<BaseResponse<any>> {
    return await this.executeQuery(UserQueries.QUERY_USER, variables);
  }

  private async executeMutation<T>(
    mutation: UserMutations,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = UserOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }
  private async executeMutationWithToken<T>(
    mutation: UserMutations,
    variables: Record<string, any>,
    accessToken: string,
  ) {
    const document: DocumentNode = UserOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, {
      variables: variables,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  private async executeMutationOnlyToken<T>(
    mutation: UserMutations,
    accessToken: string,
  ) {
    const document: DocumentNode = UserOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  private async executeQuery<T>(
    query: UserQueries,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = UserOperations[query];
    return await this.graphQLTestHelper.execute<T>(document, variables);
  }
}
