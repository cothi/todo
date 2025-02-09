import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';
import { BaseHelper } from './abstract/help.abstract';

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

export class UserTestHelper extends BaseHelper {
  async createUser(variables: CreateUserVariables): Promise<BaseResponse<any>> {
    const document = UserOperations[UserMutations.CREATE_USER];
    return await this.execute(document, { variables });
  }

  async updateUser(
    variables: UpdateUserVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = UserOperations[UserMutations.UPDATE_USER];
    return await this.execute(document, {
      variables,
      accessToken,
    });
  }

  async deleteUser(accessToken: string): Promise<BaseResponse<any>> {
    const document = UserOperations[UserMutations.DELETE_USER];
    return await this.execute(document, { accessToken });
  }

  async queryUser(variables: QueryUserVariables): Promise<BaseResponse<any>> {
    const document = UserOperations[UserQueries.QUERY_USER];
    return await this.execute(document, { variables });
  }
}
