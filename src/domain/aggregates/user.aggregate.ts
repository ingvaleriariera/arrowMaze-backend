import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';
import { UserRole } from '../value-objects/user-role.vo';

export class User {
  private constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly username: Username,
    private readonly passwordHash: PasswordHash,
    private readonly role: UserRole,
    private readonly createdAt: Date,
  ) {}

  static register(
    email: Email,
    username: Username,
    passwordHash: PasswordHash,
  ): User {
    return new User(
      UserId.generate(),
      email,
      username,
      passwordHash,
      UserRole.player(),
      new Date(),
    );
  }

  static reconstitute(
    id: UserId,
    email: Email,
    username: Username,
    passwordHash: PasswordHash,
    role: UserRole,
    createdAt: Date,
  ): User {
    return new User(id, email, username, passwordHash, role, createdAt);
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getUsername(): Username {
    return this.username;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  getRole(): UserRole {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  changeUsername(newUsername: Username): void {
    Object.assign(this, { username: newUsername });
  }

  promoteToAdmin(): void {
    Object.assign(this, { role: UserRole.admin() });
  }
}
