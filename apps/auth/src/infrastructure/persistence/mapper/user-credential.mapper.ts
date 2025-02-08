import { UserCredential } from '@auth/domain/entities/user-credential.entity';

interface UserCredentialRecord {
  id: string;
  userId: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserCredentialMapper {
  static toPersistence(entity: UserCredential): UserCredentialRecord {
    return {
      id: entity.id,
      email: entity.email,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      passwordHash: entity.passwordHash,
    };
  }

  static toDomain(record: UserCredentialRecord) {
    return UserCredential.fromPersistence({
      id: record.id,
      email: record.email,
      userId: record.userId,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      passwordHash: record.passwordHash,
    });
  }
}
