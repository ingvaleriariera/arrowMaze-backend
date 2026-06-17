/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { LevelId } from '../value-objects/level-id.vo';
import { Difficulty } from '../value-objects/difficulty.vo';

// TODO: Import LevelDefinition entity once it's created in Capa 2
export interface ILevelDefinitionRepository {
  save(level: any): Promise<void>;
  findById(id: LevelId): Promise<any | null>;
  findAll(): Promise<any[]>;
  findByDifficulty(difficulty: Difficulty): Promise<any[]>;
}
