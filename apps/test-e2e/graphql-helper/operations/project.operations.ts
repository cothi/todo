import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';
import { BaseHelper } from './abstract/help.abstract';

export enum ProjectMutations {
  CREATE_PROJECT = 'CREATE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
}

export enum ProjectQueries {
  QUERY_PROJECT = 'QUERY_PROJECT',
}

export const ProjectOperations = {
  [ProjectMutations.CREATE_PROJECT]: gql`
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
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

  [ProjectMutations.UPDATE_PROJECT]: gql`
    mutation UpdateProject($input: UpdateProjectInput!) {
      updateProject(input: $input) {
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

  [ProjectMutations.DELETE_PROJECT]: gql`
    mutation DeleteProject($input: DeleteProjectInput!) {
      deleteProject(input: $input) {
        status
        success
        message
        data {
          id
        }
      }
    }
  `,

  [ProjectQueries.QUERY_PROJECT]: gql`
    query QueryProject($input: QueryProjectInput!) {
      queryProject(input: $input) {
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
};

export interface ProjectInputBase {
  id: string;
  name: string;
}

export interface CreateProjectVariables {
  input: Pick<ProjectInputBase, 'name'>;
}

export interface UpdateProjectVariables {
  input: {
    projectId: string;
    name: string;
  };
}

export interface DeleteProjectVariables {
  input: {
    projectId: string;
  };
}

export interface QueryProjectVariables {
  input: {
    projectId: string;
  };
}

export interface Options {
  accessToken?: string;
  variables?: Record<string, any>;
}

export class ProjectTestHelper extends BaseHelper {
  async createProject(
    variables: CreateProjectVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = ProjectOperations[ProjectMutations.CREATE_PROJECT];
    return await this.execute(document, {
      accessToken,
      variables,
    });
  }

  async updateProject(
    variables: UpdateProjectVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = ProjectOperations[ProjectMutations.UPDATE_PROJECT];
    return await this.execute(document, {
      accessToken,
      variables,
    });
  }

  async deleteProject(
    variables: DeleteProjectVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = ProjectOperations[ProjectMutations.DELETE_PROJECT];
    return await this.execute(document, {
      accessToken,
      variables,
    });
  }

  async queryProject(
    variables: QueryProjectVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = ProjectOperations[ProjectQueries.QUERY_PROJECT];
    return await this.execute(document, {
      accessToken,
      variables,
    });
  }
}
