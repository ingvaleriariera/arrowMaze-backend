import { CustomBoard } from '../aggregates/custom-board.aggregate';

export const CUSTOM_BOARD_REPOSITORY = 'CUSTOM_BOARD_REPOSITORY';

export interface ICustomBoardRepository {
  save(board: CustomBoard): Promise<void>;

  /** Newest first, capped at [limit]. */
  findAll(limit: number): Promise<CustomBoard[]>;
}
