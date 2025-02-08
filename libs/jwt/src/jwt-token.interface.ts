import { TokenEnum } from '@libs/jwt';

export interface JwtPayload {
  userId: string;
  type: TokenEnum;
}

export interface AccessTokenPayload {
  userId: string;
}
export interface JwtPairPayload {
  userId: string;
}

export interface JwtVerifyResult {
  isValid: boolean;
  payload: JwtPayload;
}

export type AccessToken = {
  token: string;
  expiresAt: Date;
};
export interface TokenPair {
  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;
}
