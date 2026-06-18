import { Injectable } from '@nestjs/common';
import { LevelDefinition } from '../../domain/aggregates/level-definition.aggregate';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { MoveLimit } from '../../domain/value-objects/move-limit.vo';
import { BoardLayout } from '../../domain/value-objects/board-layout.vo';

@Injectable()
export class LevelConfigBuilder {
  private id: string | undefined;
  private difficulty: string | undefined;
  private moveLimit: number | undefined;
  private boardLayout: string | undefined;

  setId(id: string): LevelConfigBuilder {
    this.id = id;
    return this;
  }

  setDifficulty(difficulty: string): LevelConfigBuilder {
    this.difficulty = difficulty;
    return this;
  }

  setMoveLimit(limit: number): LevelConfigBuilder {
    this.moveLimit = limit;
    return this;
  }

  setBoardLayout(json: string): LevelConfigBuilder {
    this.boardLayout = json;
    return this;
  }

  build(): LevelDefinition {
    if (!this.id) {
      throw new Error('LevelConfigBuilder: id is required');
    }
    if (!this.difficulty) {
      throw new Error('LevelConfigBuilder: difficulty is required');
    }
    if (this.moveLimit === undefined) {
      throw new Error('LevelConfigBuilder: moveLimit is required');
    }
    if (!this.boardLayout) {
      throw new Error('LevelConfigBuilder: boardLayout is required');
    }

    const levelId = LevelId.create(this.id);
    const difficultyVO = Difficulty.create(this.difficulty);
    const moveLimitVO = MoveLimit.create(this.moveLimit);
    const boardLayoutVO = BoardLayout.create(this.boardLayout);

    return LevelDefinition.create(
      levelId,
      difficultyVO,
      moveLimitVO,
      boardLayoutVO,
    );
  }

  reset(): LevelConfigBuilder {
    this.id = undefined;
    this.difficulty = undefined;
    this.moveLimit = undefined;
    this.boardLayout = undefined;
    return this;
  }
}
