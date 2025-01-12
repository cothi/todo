import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BasicLoginCommand } from '@auth/application/commands/basic-login.command';
import { TokenService } from '@auth/application/services/token.service';
import {
  BaseBusinessException,
  ErrorCode,
  errorFactory,
} from '@libs/exception';
import { Token } from '@auth/domain/entities/token.entity';
import { UserCredentialService } from '@auth/application/services/user-credential.service';

@CommandHandler(BasicLoginCommand)
export class BasicLoginHandler implements ICommandHandler {
  constructor(
    private readonly userAuthService: UserCredentialService,
    private readonly tokenService: TokenService,
  ) {}
  async execute(command: BasicLoginCommand): Promise<Token> {
    try {
      const credential = await this.userAuthService.validatePassword({
        email: command.email,
        password: command.password,
      });
      return await this.tokenService.createToken({
        userId: credential.userId,
      });
    } catch (err) {
      if (err instanceof BaseBusinessException) {
        throw errorFactory(err.errorCode);
      }
      throw errorFactory(ErrorCode.INTERNAL_SERVER_ERROR, err.messages);
    }
  }
}
