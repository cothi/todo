import { Token } from '@auth/domain/entities/token.entity';

interface TokenRecord {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
export class TokenMapper {
  static toPersistence(entity: Token): TokenRecord {
    return {
      id: entity.id,
      userId: entity.userId,
      expiresAt: entity.expiresAt,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      refreshToken: entity.hashedRefreshToken,
      isRevoked: entity.isRevoked,
      accessToken: entity.hashedAccessToken,
    };
  }

  static toDomain(record: TokenRecord): Token {
    return Token.fromPersistence({
      id: record.id,
      userId: record.userId,
      expiresAt: record.expiresAt,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      isRevoked: record.isRevoked,
      hashedRefreshToken: record.refreshToken,
      hashedAccessToken: record.accessToken,
    });
  }
}
