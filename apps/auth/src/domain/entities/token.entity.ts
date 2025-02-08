import { BaseEntity, BaseEntityProps } from '@libs/entity';
import { DomainException, ErrorCode } from '@libs/exception';
import { v4 as uuid } from 'uuid';

export type Keys<T> = keyof T;
export type OmitType<T, K extends Keys<T>> = Omit<T, K>;

export type TokenMutableProps = {
  hashedAccessToken: string;
  isRevoked: boolean;
};
export type TokenImutableProps = {
  readonly userId: string;
  readonly hashedRefreshToken: string;
  readonly expiresAt: Date;
};

export type TokenProps = TokenMutableProps &
  TokenImutableProps &
  BaseEntityProps;
export type CreateTokenProps = Omit<
  TokenMutableProps & TokenImutableProps,
  'isRevoke'
>;

export class Token extends BaseEntity<TokenProps> {
  static create(props: OmitType<CreateTokenProps, 'isRevoked'>): Token {
    const now = new Date();
    const id = uuid();
    const isRevoked = false;
    return new Token({
      createdAt: now,
      updatedAt: now,
      expiresAt: props.expiresAt,
      hashedAccessToken: props.hashedAccessToken,
      hashedRefreshToken: props.hashedRefreshToken,
      id: id,
      isRevoked: isRevoked,
      userId: props.userId,
    });
  }

  static fromPersistence(props: TokenProps): Token {
    return new Token({
      createdAt: props.createdAt,
      expiresAt: props.expiresAt,
      hashedAccessToken: props.hashedAccessToken,
      hashedRefreshToken: props.hashedRefreshToken,
      id: props.id,
      isRevoked: props.isRevoked,
      updatedAt: props.updatedAt,
      userId: props.userId,
    });
  }

  update(partialProps: Partial<TokenMutableProps>): void {
    Object.assign(this.props, partialProps);
    this.updateTimestamp();
  }

  get userId() {
    return this.props.userId;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get isRevoked() {
    return this.props.isRevoked;
  }

  get hashedRefreshToken() {
    return this.props.hashedAccessToken;
  }

  get hashedAccessToken() {
    return this.props.hashedAccessToken;
  }

  revokeToken(): void {
    if (this.props.isRevoked) {
      throw new DomainException(ErrorCode.UNAUTHORIZED);
    }
    this.props.isRevoked = true;
    this.props.updatedAt = new Date();
  }
  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }
}
