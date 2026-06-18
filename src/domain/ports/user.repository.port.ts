import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { User } from '../aggregates/user.aggregate';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
