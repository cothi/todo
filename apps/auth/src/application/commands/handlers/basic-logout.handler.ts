import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BasicLogoutCommand } from '@auth/application/commands/basic-logout.command';
import { TokenService } from '@auth/application/services/token.service';
import {
  BaseBusinessException,
  ErrorCode,
  errorFactory,
} from '@libs/exception';

@CommandHandler(BasicLogoutCommand)
export class BasicLogoutHandler implements ICommandHandler {
  constructor(private readonly tokenService: TokenService) {}
  async execute(command: BasicLogoutCommand): Promise<void> {
    try {
      await this.tokenService.revokeToken({
        refreshToken: command.refreshToken,
      });
    } catch (err) {
      if (err instanceof BaseBusinessException) {
        errorFactory(err.errorCode);
      }
      throw errorFactory(ErrorCode.INTERNAL_SERVER_ERROR, err.message);
    }
  }
}