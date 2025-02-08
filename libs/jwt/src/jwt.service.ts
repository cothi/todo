import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessToken,
  AccessTokenPayload,
  JwtPairPayload,
  JwtPayload,
  TokenPair,
} from '@libs/jwt/jwt-token.interface';
import { TokenEnum, TokenTimeEnum } from '@libs/jwt';
import { ErrorCode, errorFactory } from '@libs/exception';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateTokenPair(payload: JwtPairPayload): TokenPair {
    const accessToken = this.generateToken({
      ...payload,
      type: TokenEnum.ACCESS,
    });
    const refreshToken = this.generateToken({
      ...payload,
      type: TokenEnum.REFRESH,
    });

    return {
      accessToken: accessToken.token,
      accessTokenExpires: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshTokenExpires: refreshToken.expiresAt,
    };
  }
  generateToken(payload: JwtPayload) {
    const expiresIn = this.getExpirationTime(payload.type);
    const token = this.jwtService.sign(payload, { expiresIn });
    const decoded = this.jwtService.decode(token) as {
      exp: number;
      iat: number;
    };
    const expiresAt = new Date(decoded.exp * 1000);
    return {
      token,
      expiresAt,
    };
  }

  generateAcceeToken(payload: AccessTokenPayload): AccessToken {
    const expiresIn = this.getExpirationTime(TokenEnum.ACCESS);
    const token = this.jwtService.sign(payload, { expiresIn });
    const decoded = this.jwtService.decode(token) as {
      exp: number;
      iat: number;
    };
    const expiresAt = new Date(decoded.exp * 1000);
    return {
      expiresAt: expiresAt,
      token: token,
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  verifyRefreshToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token);
    if (payload.type !== TokenEnum.REFRESH) {
      throw errorFactory(ErrorCode.INVALID_TOKEN);
    }
  }

  // 30m, 3d
  private getExpirationTime(tokenType: TokenEnum) {
    return this.configService.get<string>(
      tokenType == TokenEnum.REFRESH
        ? TokenTimeEnum.REFRESH
        : TokenTimeEnum.ACCESS,
    );
  }
}
