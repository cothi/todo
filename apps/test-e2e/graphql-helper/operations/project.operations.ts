import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';

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

export class ProjectTestHelper {
  constructor(private readonly graphQLTestHelper: GraphQLTestHelper) {}

  async createProject(variables: {
    input: { name: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(
      ProjectMutations.CREATE_PROJECT,
      variables,
    );
  }

  async updateProject(variables: {
    input: { projectId: string; name: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(
      ProjectMutations.UPDATE_PROJECT,
      variables,
    );
  }

  async deleteProject(variables: {
    input: { projectId: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(
      ProjectMutations.DELETE_PROJECT,
      variables,
    );
  }

  async queryProject(variables: {
    input: { projectId: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeQuery(ProjectQueries.QUERY_PROJECT, variables);
  }

  private async executeMutation<T>(
    mutation: ProjectMutations,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = ProjectOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }

  private async executeQuery<T>(
    query: ProjectQueries,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = ProjectOperations[query];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }
}
