// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.2
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export interface CreateUserCredentialRequest {
  userId: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserCredentialRequest {
  userId: string;
  email?: string | undefined;
  passwordHash?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface CreateUserResponse {
  success: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  createUserCredential(
    request: CreateUserCredentialRequest,
  ): Observable<CreateUserResponse>;
  updateUserCredential(
    request: UpdateUserCredentialRequest,
  ): Observable<UpdateUserCredentialRequest>;
}

export interface AuthServiceController {
  createUserCredential(
    request: CreateUserCredentialRequest,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

  updateUserCredential(
    request: UpdateUserCredentialRequest,
  ):
    | Promise<UpdateUserCredentialRequest>
    | Observable<UpdateUserCredentialRequest>
    | UpdateUserCredentialRequest;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createUserCredential',
      'updateUserCredential',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';
