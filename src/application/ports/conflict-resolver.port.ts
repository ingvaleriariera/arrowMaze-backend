import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';

export const CONFLICT_RESOLVER = 'CONFLICT_RESOLVER';

export interface IConflictResolver {
  resolve(local: PlayerProgress, remote: PlayerProgress): PlayerProgress;
}
