import { Inject, Injectable } from '@nestjs/common';
import type { ICustomBoardRepository } from '../../domain/ports/custom-board.repository.port';
import { CUSTOM_BOARD_REPOSITORY } from '../../domain/ports/custom-board.repository.port';
import { CustomBoardId } from '../../domain/value-objects/custom-board-id.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class DeleteCustomBoardUseCase {
  constructor(
    @Inject(CUSTOM_BOARD_REPOSITORY)
    private readonly customBoardRepository: ICustomBoardRepository,
  ) {}

  /**
   * Removes a published board. Only its author may delete it — anyone
   * else gets rejected regardless of the board existing.
   */
  async execute(requesterId: string, boardId: string): Promise<void> {
    const id = CustomBoardId.create(boardId);
    const board = await this.customBoardRepository.findById(id);

    if (!board) {
      throw new Error('Board not found');
    }

    if (!board.getAuthorId().equals(UserId.create(requesterId))) {
      throw new Error('Only the author can delete this board');
    }

    await this.customBoardRepository.delete(id);
  }
}
