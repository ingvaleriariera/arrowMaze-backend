import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { PasswordHash } from '../../domain/value-objects/password-hash.vo';
import { UserRole } from '../../domain/value-objects/user-role.vo';

@Injectable()
export class UserEntityMapper {
  toDomain(entity: UserEntity): User {
    const id = UserId.create(entity.id);
    const email = Email.create(entity.email);
    const username = Username.create(entity.username);
    const passwordHash = PasswordHash.create(entity.passwordHash);
    const role = UserRole.create(entity.role);
    const createdAt = entity.createdAt;

    return User.reconstitute(id, email, username, passwordHash, role, createdAt);
  }

  toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId().toString();
    entity.email = user.getEmail().toString();
    entity.username = user.getUsername().toString();
    entity.passwordHash = user.getPasswordHash().toString();
    entity.role = user.getRole().getValue();
    entity.createdAt = user.getCreatedAt();
    return entity;
  }
}
