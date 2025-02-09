import { DocumentNode } from 'graphql';
import { BaseResponse, GraphQLTestHelper } from '../../graphql.helper';

export interface Options {
  accessToken: string;
  variables: Record<string, any>;
}

export abstract class BaseHelper {
  constructor(protected readonly graphQLTestHelper: GraphQLTestHelper) {}

  protected async execute<T>(
    documentNode: DocumentNode,
    options: Partial<Options>,
  ): Promise<T> {
    return await this.graphQLTestHelper.execute<T>(documentNode, {
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
      },
      variables: options.variables,
    });
  }
}
