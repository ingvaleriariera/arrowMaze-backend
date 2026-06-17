/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

// TODO: Import User entity once it's created in Capa 2
export interface IUserRepository {
  save(user: any): Promise<void>;
  findByEmail(email: Email): Promise<any | null>;
  findById(id: UserId): Promise<any | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
