import { Injectable } from '@nestjs/common';
import { Token } from '../entities/token.entity';
import { ErrorCode, errorFactory } from '@libs/exception';

export class TokenPolicyLogic {
  static changeAccessToken(token: Token, hashedAccessToken: string) {
    if (token.isExpired() || token.isRevoked) {
      throw errorFactory(ErrorCode.UNAUTHORIZED);
    }

    token.update({
      hashedAccessToken: hashedAccessToken,
    });
  }
}
