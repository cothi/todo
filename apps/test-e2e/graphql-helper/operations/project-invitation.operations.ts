import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { BaseHelper } from './abstract/help.abstract';

export enum ProjectInvitationMutations {
  CREATE_PROJECT_INVITATION = 'CREATE_PROJECT_INVITATION',
  ACCEPT_PROJECT_INVITATION = 'ACCEPT_PROJECT_INVITATION',
  REJECT_PROJECT_INVITATION = 'REJECT_PROJECT_INVITATION',
}

export const ProjectInvitationOperations = {
  [ProjectInvitationMutations.CREATE_PROJECT_INVITATION]: gql`
    mutation CreateProjectInvitation($input: CreateProjectInvitationInput!) {
      createProjectInvitation(input: $input) {
        status
        success
        message
        data {
          id
          projectId
          inviteeUserId
          inviterUserId
          status
        }
      }
    }
  `,
  [ProjectInvitationMutations.ACCEPT_PROJECT_INVITATION]: gql`
    mutation AcceptProjectInvitation($input: AcceptProjectInvitationInput!) {
      acceptProjectInvitation(input: $input) {
        status
        success
        message
        data {
          id
          status
        }
      }
    }
  `,
  [ProjectInvitationMutations.REJECT_PROJECT_INVITATION]: gql`
    mutation RejectProjectInvitation($input: RejectProjectInvitationInput!) {
      rejectProjectInvitation(input: $input) {
        status
        success
        message
        data {
          id
          status
        }
      }
    }
  `,
};

export interface CreateProjectInvitationVariables {
  input: {
    projectId: string;
    inviteeUserId: string;
  };
}

export interface AcceptProjectInvitationVariables {
  input: {
    id: string;
  };
}

export interface RejectProjectInvitationVariables {
  input: {
    id: string;
  };
}

export class ProjectInvitationTestHelper extends BaseHelper {
  async createProjectInvitation(
    variables: CreateProjectInvitationVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document =
      ProjectInvitationOperations[
        ProjectInvitationMutations.CREATE_PROJECT_INVITATION
      ];
    return await this.execute(document, { variables, accessToken });
  }

  async acceptProjectInvitation(
    variables: AcceptProjectInvitationVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document =
      ProjectInvitationOperations[
        ProjectInvitationMutations.ACCEPT_PROJECT_INVITATION
      ];
    return await this.execute(document, { variables, accessToken });
  }

  async rejectProjectInvitation(
    variables: RejectProjectInvitationVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document =
      ProjectInvitationOperations[
        ProjectInvitationMutations.REJECT_PROJECT_INVITATION
      ];
    return await this.execute(document, { variables, accessToken });
  }
}
