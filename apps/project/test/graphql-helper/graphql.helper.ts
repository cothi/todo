import { INestApplication } from '@nestjs/common';
import { DocumentNode, print } from 'graphql';
import * as request from 'supertest';

// 기본 응답 타입을 제네릭으로 정의
export interface BaseResponse<T> {
  status: string;
  success: boolean;
  message: string;
  data: T;
}

// GraphQL 응답 타입 정의
interface GraphQLResponse<T> {
  data?: {
    [key: string]: T; // BaseResponse<T> 대신 T로 유연하게 처리
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
    extensions: {
      code: string;
      status: number;
      success: boolean;
    };
  }>;
}

// 커스텀 에러 클래스
export class GraphQLError extends Error {
  constructor(
    message: string,
    public readonly success: boolean,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'GraphQLError';
  }
}

export class GraphQLTestHelper {
  constructor(private readonly app: INestApplication) {}

  async execute<TData = any, TVariables = Record<string, any>>(
    document: DocumentNode,
    variables?: TVariables,
    headers?: Record<string, string>, // 헤더 추가
  ): Promise<TData> {
    const requestBuilder = request(this.app.getHttpServer())
      .post('/graphql')
      .send({
        query: print(document),
        variables,
      });

    if (headers) {
      requestBuilder.set(headers);
    }

    const response = await requestBuilder;

    const body = response.body as GraphQLResponse<TData>;

    if (body.errors) {
      const firstError = body.errors[0];
      throw new GraphQLError(
        firstError.message,
        firstError.extensions.success,
        firstError.extensions.code,
        firstError.extensions.status,
      );
    }

    if (!body.data) {
      throw new Error('No data found in the response');
    }

    const operationKey = Object.keys(body.data)[0];
    return body.data[operationKey];
  }
}
