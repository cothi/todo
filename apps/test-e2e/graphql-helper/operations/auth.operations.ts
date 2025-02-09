import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { BaseHelper } from './abstract/help.abstract';

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

export class AuthTestHelper extends BaseHelper {
  async login(variables: LoginVariables): Promise<BaseResponse<any>> {
    const document = AuthOperations[AuthMutations.BASIC_LOGIN];
    return await this.execute(document, { variables });
  }

  async logout(variables: LogoutVariables): Promise<BaseResponse<any>> {
    const document = AuthOperations[AuthMutations.BASIC_LOGOUT];
    return await this.execute(document, { variables });
  }

  async reissueToken(
    variables: ReissueTokenVariables,
  ): Promise<BaseResponse<any>> {
    const document = AuthOperations[AuthMutations.REISSUE_TOKEN];
    return await this.execute(document, { variables });
  }
}
