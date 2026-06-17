import { LevelId } from '../value-objects/level-id.vo';

// TODO: Import ScoreEntry entity once it's created in Capa 2
export interface IScoreRepository {
  save(entry: any): Promise<void>;
  findTopByLevel(levelId: LevelId, limit: number): Promise<any[]>;
}
