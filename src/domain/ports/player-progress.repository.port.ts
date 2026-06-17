/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { UserId } from '../value-objects/user-id.vo';

// TODO: Import PlayerProgress entity once it's created in Capa 2
export interface IPlayerProgressRepository {
  save(progress: any): Promise<void>;
  findByUserId(userId: UserId): Promise<any | null>;
}
