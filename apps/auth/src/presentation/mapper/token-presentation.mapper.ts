import { ReissueTokenCommand } from '@auth/application/commands/reissue-token.command';
import { ReissueTokenInput } from '@auth/presentation/resolver/dto/input/reissue-token.input';
import { ReissueTokenOutput } from '@auth/presentation/resolver/dto/output/reissue-token.output';
import { AccessToken } from '@libs/jwt';

export class TokenPresentationMapper {
  static toReissueTokenCommand(input: ReissueTokenInput): ReissueTokenCommand {
    return {
      refreshToken: input.refreshToken,
    };
  }

  static resultToTokenReissueOutput(data: AccessToken): ReissueTokenOutput {
    return {
      accessToken: data.token,
    };
  }
}
