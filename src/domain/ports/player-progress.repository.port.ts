import { UserId } from '../value-objects/user-id.vo';
import { PlayerProgress } from '../aggregates/player-progress.aggregate';

export const PLAYER_PROGRESS_REPOSITORY = 'PLAYER_PROGRESS_REPOSITORY';

export interface IPlayerProgressRepository {
  save(progress: PlayerProgress): Promise<void>;
  findByUserId(userId: UserId): Promise<PlayerProgress | null>;
  findAll(): Promise<PlayerProgress[]>;
}
