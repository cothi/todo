import { LoginInput } from '@auth/presentation/resolver/dto/input/login.input';
import { BasicLoginCommand } from '@auth/application/commands/basic-login.command';
import { LogoutInput } from '@auth/presentation/resolver/dto/input/logout.input';
import { BasicLogoutCommand } from '@auth/application/commands/basic-logout.command';
import { Token } from '@auth/domain/entities/token.entity';
import { LoginOutput } from '@auth/presentation/resolver/dto/output/login.output';
import { LogoutOutput } from '@auth/presentation/resolver/dto/output/logout.output';
import { TokenPair } from '@libs/jwt';

export class BasicAuthPresentationMapper {
  static toBasicLogoutCommand(input: LogoutInput): BasicLogoutCommand {
    return new BasicLogoutCommand(input.refreshToken);
  }

  static toBasicLoginCommand(input: LoginInput): BasicLoginCommand {
    return new BasicLoginCommand(input.email, input.password);
  }

  static resultToLoginOutput(result: TokenPair): LoginOutput {
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  static resultToLogoutOutput(result: Token): LogoutOutput {
    return {
      userId: result.userId,
    };
  }
}
