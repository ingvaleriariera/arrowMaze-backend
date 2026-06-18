import { LevelId } from '../value-objects/level-id.vo';
import { Difficulty } from '../value-objects/difficulty.vo';
import { MoveLimit } from '../value-objects/move-limit.vo';
import { BoardLayout } from '../value-objects/board-layout.vo';

export class LevelDefinition {
  private constructor(
    private readonly id: LevelId,
    private readonly difficulty: Difficulty,
    private readonly moveLimit: MoveLimit,
    private readonly boardLayout: BoardLayout,
    private version: number,
  ) {}

  static create(
    id: LevelId,
    difficulty: Difficulty,
    moveLimit: MoveLimit,
    boardLayout: BoardLayout,
  ): LevelDefinition {
    return new LevelDefinition(id, difficulty, moveLimit, boardLayout, 1);
  }

  static reconstitute(
    id: LevelId,
    difficulty: Difficulty,
    moveLimit: MoveLimit,
    boardLayout: BoardLayout,
    version: number,
  ): LevelDefinition {
    return new LevelDefinition(id, difficulty, moveLimit, boardLayout, version);
  }

  getId(): LevelId {
    return this.id;
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getMoveLimit(): MoveLimit {
    return this.moveLimit;
  }

  getBoardLayout(): BoardLayout {
    return this.boardLayout;
  }

  getVersion(): number {
    return this.version;
  }

  updateLayout(newLayout: BoardLayout): void {
    Object.assign(this, { boardLayout: newLayout, version: this.version + 1 });
  }

  updateMoveLimit(newLimit: MoveLimit): void {
    Object.assign(this, { moveLimit: newLimit, version: this.version + 1 });
  }
}
