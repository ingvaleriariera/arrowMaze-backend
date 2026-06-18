import { LevelId } from '../value-objects/level-id.vo';
import { ScoreEntry } from '../aggregates/score-entry.aggregate';

export const SCORE_REPOSITORY = 'SCORE_REPOSITORY';

export interface IScoreRepository {
  save(entry: ScoreEntry): Promise<void>;
  findTopByLevel(levelId: LevelId, limit: number): Promise<ScoreEntry[]>;
}
