import { LevelId } from '../value-objects/level-id.vo';
import { Difficulty } from '../value-objects/difficulty.vo';
import { LevelDefinition } from '../aggregates/level-definition.aggregate';

export const LEVEL_DEFINITION_REPOSITORY = 'LEVEL_DEFINITION_REPOSITORY';

export interface ILevelDefinitionRepository {
  save(level: LevelDefinition): Promise<void>;
  findById(id: LevelId): Promise<LevelDefinition | null>;
  findAll(): Promise<LevelDefinition[]>;
  findByDifficulty(difficulty: Difficulty): Promise<LevelDefinition[]>;
}
