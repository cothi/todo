import { ReissueTokenInput } from '@auth/presentation/resolver/dto/input/reissue-token.input';
import { ReissueTokenCommand } from '@auth/application/commands/reissue-token.command';
import { Token } from '@auth/domain/entities/token.entity';
import { ReissueTokenOutput } from '@auth/presentation/resolver/dto/output/reissue-token.output';

export class TokenPresentationMapper {
  static toReissueTokenCommand(input: ReissueTokenInput): ReissueTokenCommand {
    return {
      refreshToken: input.refreshToken,
    };
  }

  static resultToTokenReissueOutput(data: Token): ReissueTokenOutput {
    return {
      userId: data.userId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }
}
