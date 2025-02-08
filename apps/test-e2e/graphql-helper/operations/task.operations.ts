import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';

export enum TaskMutations {
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
}

export enum TaskQueries {
  QUERY_TASK = 'QUERY_TASK',
}

export const TaskOperations = {
  [TaskMutations.CREATE_TASK]: gql`
    mutation CreateTask($input: CreateTaskInput!) {
      createTask(input: $input) {
        status
        success
        message
        data {
          id
          title
          categoryId
          startDate
          endDate
        }
      }
    }
  `,

  [TaskMutations.UPDATE_TASK]: gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        status
        success
        message
        data {
          id
          title
        }
      }
    }
  `,

  [TaskMutations.DELETE_TASK]: gql`
    mutation DeleteTask($input: DeleteTaskInput!) {
      deleteTask(input: $input) {
        status
        success
        message
      }
    }
  `,

  [TaskQueries.QUERY_TASK]: gql`
    query QueryTask($input: QueryTaskInput!) {
      queryTask(input: $input) {
        status
        success
        message
        data {
          id
          title
          categoryId
          startDate
          endDate
        }
      }
    }
  `,
};

export interface CreateTaskInput {
  categoryId: string;
  title: string;
  startDate: string;
  endDate: string;
}

export class TaskTestHelper {
  constructor(private readonly graphQLTestHelper: GraphQLTestHelper) {}

  async createTask(variables: {
    input: CreateTaskInput;
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(TaskMutations.CREATE_TASK, variables);
  }

  async updateTask(variables: {
    input: { id: string; title?: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(TaskMutations.UPDATE_TASK, variables);
  }

  async deleteTask(variables: {
    input: { id: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeMutation(TaskMutations.DELETE_TASK, variables);
  }

  async queryTask(variables: {
    input: { id: string };
  }): Promise<BaseResponse<any>> {
    return await this.executeQuery(TaskQueries.QUERY_TASK, variables);
  }

  private async executeMutation<T>(
    mutation: TaskMutations,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = TaskOperations[mutation];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }

  private async executeQuery<T>(
    query: TaskQueries,
    variables: Record<string, any>,
  ) {
    const document: DocumentNode = TaskOperations[query];
    return await this.graphQLTestHelper.execute<T>(document, { variables });
  }
}
