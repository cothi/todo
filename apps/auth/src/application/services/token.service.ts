import { CreateTokenParam } from '@auth/application/dto/params/create-token.param';
import { RevokeTokenParam } from '@auth/application/dto/params/revoke-token.param';
import { ReissueTokenParam } from '@auth/application/dto/params/update-access-token.param';
import {
  ITokensRepository,
  TokenRepositorySymbol,
} from '@auth/application/port/out/token-repository.port';
import { Token } from '@auth/domain/entities/token.entity';
import { TokenPolicyLogic } from '@auth/domain/logic/token-policy.logic';
import { ApplicationException, ErrorCode } from '@libs/exception';
import { AccessToken, JwtTokenService, TokenEnum, TokenPair } from '@libs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * 토큰의 유효성 관련 서비스를 제공하는 클래스입니다.
 * 토큰의 생성, 업데이트, 무효화의 기능을 담당합니다.
 */
@Injectable()
export class TokenService {
  constructor(
    @Inject(TokenRepositorySymbol)
    private readonly tokenRepository: ITokensRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  /**
   * 새로운 토큰을 저장합니다.
   * @param param - 새로운 토큰을 저장할 필요한 정보를 담은 파리미터
   */
  async createToken(param: CreateTokenParam): Promise<TokenPair> {
    // 토큰 저장
    const tokenPair = this.issueTokenPair(param.userId);
    const token = Token.create({
      expiresAt: tokenPair.refreshTokenExpires,
      hashedAccessToken: this.hash(tokenPair.accessToken),
      hashedRefreshToken: this.hash(tokenPair.refreshToken),
      userId: param.userId,
    });
    await this.tokenRepository.save(token);
    return tokenPair;
  }

  /**
   * 저장된 토큰의 정보를 업데이트합니다.
   * @param param - 저장된 토큰의 업데이트할 정보를 담은 파라미터
   */
  async reissueTokens(param: ReissueTokenParam): Promise<AccessToken> {
    // refresh token 검증 및 블랙리스트 확인
    const token = await this.tokenRepository.findTokenByRefreshToken({
      refreshToken: param.refreshToken,
    });
    if (!token) {
      throw new ApplicationException(ErrorCode.UNAUTHORIZED);
    }

    this.jwtTokenService.verifyRefreshToken(param.refreshToken);

    // 토큰 재발급 및 DB 반영
    const reissuedToken = this.reissueAccessToken(token.userId);
    TokenPolicyLogic.changeAccessToken(token, reissuedToken.token);
    await this.tokenRepository.update(token);
    return reissuedToken;
  }

  /**
   * 저장된 토큰의 발급을 무효화 합니다.
   * @param param - 무효화할 토큰의 정보가 담긴 파라미터
   */
  async revokeToken(param: RevokeTokenParam): Promise<Token> {
    // userId의 토큰 가져오기
    const token = await this.tokenRepository.findTokenByRefreshToken({
      refreshToken: param.refreshToken,
    });
    if (!token) {
      throw new ApplicationException(ErrorCode.UNAUTHORIZED);
    }
    // 토큰 무효화 및 DB 반영
    token.revokeToken();
    await this.tokenRepository.update(token);
    return token;
  }

  /**
   * 유효시간이 지난 토큰을 무효화 합니다.
   */
  async deleteRevokedAllTokens(): Promise<void> {
    // 유효기간이 지난  기존 모든 토큰 을 무효화 합니다.
    await this.tokenRepository.deleteAllRevokeExpiredToken();
  }

  private issueTokenPair(userId: string): TokenPair {
    return this.jwtTokenService.generateTokenPair({
      userId: userId,
    });
  }
  private reissueAccessToken(userId: string): AccessToken {
    return this.jwtTokenService.generateToken({
      type: TokenEnum.ACCESS,
      userId: userId,
    });
  }

  private hash(str: string): string {
    return createHash('sha256').update(str).digest('hex');
  }
}
