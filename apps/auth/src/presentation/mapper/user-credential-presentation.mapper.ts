import {
  DeleteUserCredentialRequest,
  StoreUserCredentialRequest,
  UpdateUserCredentialRequest,
} from '@libs/grpc';
import { UpdateUserCredentialCommand } from '@auth/application/commands/update-user-credential.command';
import { DeleteUserCredentialCommand } from '@auth/application/commands/delete-user-credential.command';
import { StoreUserCredentialCommand } from '@auth/application/commands/store-user-credential.command';

export class UserCredentialPresentationMapper {
  static toStoreUserCredentialCommand(
    request: StoreUserCredentialRequest,
  ): StoreUserCredentialCommand {
    return new StoreUserCredentialCommand(
      request.userId,
      request.email,
      request.passwordHash,
    );
  }

  static toUpdateUserCredentialCommand(
    request: UpdateUserCredentialRequest,
  ): UpdateUserCredentialCommand {
    return {
      userId: request.userId,
      email: request.email,
      passwordHash: request.passwordHash,
    };
  }

  static toDeleteUserCredentialCommand(
    request: DeleteUserCredentialRequest,
  ): DeleteUserCredentialCommand {
    return {
      userId: request.userId,
    };
  }
}
