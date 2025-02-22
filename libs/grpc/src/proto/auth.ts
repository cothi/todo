// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.2
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface StoreUserCredentialRequest {
  userId: string;
  email: string;
  passwordHash: string;
}

export interface UpdateUserCredentialRequest {
  userId: string;
  email?: string | undefined;
  passwordHash?: string | undefined;
}

export interface DeleteUserCredentialRequest {
  userId: string;
}

export interface StoreUserCredentialResponse {
  success: boolean;
}

export interface UpdateUserCredentialResponse {
  success: boolean;
}

export interface DeleteUserCredentialResponse {
  success: boolean;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  storeUserCredential(request: StoreUserCredentialRequest): Observable<StoreUserCredentialResponse>;

  updateUserCredential(request: UpdateUserCredentialRequest): Observable<UpdateUserCredentialResponse>;

  deleteUserCredential(request: DeleteUserCredentialRequest): Observable<DeleteUserCredentialResponse>;
}

export interface AuthServiceController {
  storeUserCredential(
    request: StoreUserCredentialRequest,
  ): Promise<StoreUserCredentialResponse> | Observable<StoreUserCredentialResponse> | StoreUserCredentialResponse;

  updateUserCredential(
    request: UpdateUserCredentialRequest,
  ): Promise<UpdateUserCredentialResponse> | Observable<UpdateUserCredentialResponse> | UpdateUserCredentialResponse;

  deleteUserCredential(
    request: DeleteUserCredentialRequest,
  ): Promise<DeleteUserCredentialResponse> | Observable<DeleteUserCredentialResponse> | DeleteUserCredentialResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["storeUserCredential", "updateUserCredential", "deleteUserCredential"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
