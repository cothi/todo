import { gql } from 'graphql-tag';
import { BaseResponse, GraphQLTestHelper } from '../graphql.helper';
import { DocumentNode } from 'graphql';
import { BaseHelper } from './abstract/help.abstract';

export enum TaskMutations {
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
}

export enum TaskQueries {
  QUERY_TASK_BY_ID = 'QUERY_TASK',
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

  [TaskQueries.QUERY_TASK_BY_ID]: gql`
    query QueryTaskById($input: QueryTaskByIdInput!) {
      queryTaskById(input: $input) {
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

export type BaseTaskVariables = {
  id: string;
  categoryId: string;
  title: string;
  startDate: string;
  endDate: string;
};
export type CreateTaskVariables = {
  input: Omit<BaseTaskVariables, 'id'>;
};
export type UpdateTaskVariables = {
  input: Pick<BaseTaskVariables, 'id' | 'title'>;
};
export type DeleteTaskVariables = {
  input: Pick<BaseTaskVariables, 'id'>;
};
export type QueryTaskVariables = {
  input: Pick<BaseTaskVariables, 'id'>;
};

export class TaskTestHelper extends BaseHelper {
  async createTask(
    variables: CreateTaskVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = TaskOperations[TaskMutations.CREATE_TASK];
    return await this.execute(document, { variables, accessToken });
  }

  async updateTask(
    variables: UpdateTaskVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = TaskOperations[TaskMutations.UPDATE_TASK];
    return await this.execute(document, {
      variables,
      accessToken,
    });
  }

  async deleteTask(
    variables: DeleteTaskVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = TaskOperations[TaskMutations.DELETE_TASK];
    return await this.execute(document, {
      variables,
      accessToken,
    });
  }

  async queryTaskById(
    variables: QueryTaskVariables,
    accessToken: string,
  ): Promise<BaseResponse<any>> {
    const document = TaskOperations[TaskQueries.QUERY_TASK_BY_ID];
    return await this.execute(document, {
      variables,
      accessToken,
    });
  }
}
