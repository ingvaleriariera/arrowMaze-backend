import { BoardLayout } from '../value-objects/board-layout.vo';
import { BoardName } from '../value-objects/board-name.vo';
import { CustomBoardId } from '../value-objects/custom-board-id.vo';
import { Difficulty } from '../value-objects/difficulty.vo';
import { UserId } from '../value-objects/user-id.vo';

/**
 * A player-designed board shape, shared with the community. Only the
 * SHAPE is stored (a 0/1 cell grid, same wire format as the seeded
 * levels' boardLayout): arrows are always generated client-side from a
 * deterministic per-board seed, exactly like standard levels.
 */
export class CustomBoard {
  /** Grid dimensions must stay playable on a phone screen. */
  static readonly minSide = 3;
  static readonly maxSide = 20;

  /** Too few active cells can't produce a meaningful puzzle. */
  static readonly minActiveCells = 10;

  private constructor(
    private readonly id: CustomBoardId,
    private readonly authorId: UserId,
    private readonly name: BoardName,
    private readonly difficulty: Difficulty,
    private readonly boardLayout: BoardLayout,
    private readonly createdAt: Date,
  ) {}

  static create(
    authorId: UserId,
    name: BoardName,
    difficulty: Difficulty,
    boardLayout: BoardLayout,
  ): CustomBoard {
    CustomBoard.validateGrid(boardLayout);
    return new CustomBoard(
      CustomBoardId.generate(),
      authorId,
      name,
      difficulty,
      boardLayout,
      new Date(),
    );
  }

  static reconstitute(
    id: CustomBoardId,
    authorId: UserId,
    name: BoardName,
    difficulty: Difficulty,
    boardLayout: BoardLayout,
    createdAt: Date,
  ): CustomBoard {
    return new CustomBoard(id, authorId, name, difficulty, boardLayout, createdAt);
  }

  /**
   * Domain rule for a valid playable shape (on top of BoardLayout's
   * generic valid-JSON check): a rectangular grid of 0/1 values within
   * size bounds and with enough active cells to build a puzzle on.
   */
  private static validateGrid(boardLayout: BoardLayout): void {
    const parsed: unknown = JSON.parse(boardLayout.toJson());
    const grid = (parsed as { grid?: unknown }).grid;

    if (!Array.isArray(grid) || grid.length === 0) {
      throw new Error('Board layout must contain a non-empty grid');
    }
    if (grid.length < CustomBoard.minSide || grid.length > CustomBoard.maxSide) {
      throw new Error(
        `Grid must have between ${CustomBoard.minSide} and ${CustomBoard.maxSide} rows`,
      );
    }

    const firstRow = grid[0] as unknown;
    if (!Array.isArray(firstRow)) {
      throw new Error('Grid rows must be arrays');
    }
    const cols = firstRow.length;
    if (cols < CustomBoard.minSide || cols > CustomBoard.maxSide) {
      throw new Error(
        `Grid must have between ${CustomBoard.minSide} and ${CustomBoard.maxSide} columns`,
      );
    }

    let activeCells = 0;
    for (const row of grid) {
      if (!Array.isArray(row) || row.length !== cols) {
        throw new Error('Grid must be rectangular');
      }
      for (const cell of row) {
        if (cell !== 0 && cell !== 1) {
          throw new Error('Grid cells must be 0 or 1');
        }
        if (cell === 1) activeCells++;
      }
    }

    if (activeCells < CustomBoard.minActiveCells) {
      throw new Error(
        `Board must have at least ${CustomBoard.minActiveCells} active cells, got: ${activeCells}`,
      );
    }
  }

  getId(): CustomBoardId {
    return this.id;
  }

  getAuthorId(): UserId {
    return this.authorId;
  }

  getName(): BoardName {
    return this.name;
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getBoardLayout(): BoardLayout {
    return this.boardLayout;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
