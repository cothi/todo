import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';

export enum AuthMutations {
  BASIC_LOGIN = 'BASIC_LOGIN',
  BASIC_LOGOUT = 'BASIC_LOGOUT',
  REISSUE_TOKEN = 'REISSUE_TOKEN',
}

export const AuthOperations = {
  [AuthMutations.BASIC_LOGIN]: gql`
    mutation BasicLogin($input: LoginInput!) {
      basicLogin(input: $input) {
        status
        success
        message
        data {
          accessToken
          refreshToken
        }
      }
    }
  `,

  [AuthMutations.BASIC_LOGOUT]: gql`
    mutation BasicLogout($input: LogoutInput!) {
      basicLogout(input: $input) {
        status
        success
        message
      }
    }
  `,

  [AuthMutations.REISSUE_TOKEN]: gql`
    mutation ReissueToken($input: ReissueTokenInput!) {
      reissueToken(input: $input) {
        status
        success
        message
        data {
          accessToken
          refreshToken
        }
      }
    }
  `,
};

export interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

export interface LogoutVariables {
  input: {
    refreshToken: string;
  };
}

export interface ReissueTokenVariables {
  input: {
    refreshToken: string;
  };
}

export class AuthTestHelper {
  constructor(private readonly graphQLTestHelper: GraphQLTestHelper) {}

  async login(variables: LoginVariables): Promise<BaseResponse<any>> {
    return await this.executeMutation(AuthMutations.BASIC_LOGIN, variables);
  }

  async logout(variables: LogoutVariables): Promise<BaseResponse<any>> {
    return await this.executeMutation(AuthMutations.BASIC_LOGOUT, variables);
  }

  async reissueToken(
    variables: ReissueTokenVariables,
  ): Promise<BaseResponse<any>> {
    return await this.executeMutation(AuthMutations.REISSUE_TOKEN, variables);
  }

  private async executeMutation<T>(
    mutation: AuthMutations,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = AuthOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }
}
