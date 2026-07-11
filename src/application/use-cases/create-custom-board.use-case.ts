import { Inject, Injectable } from '@nestjs/common';
import type { ICustomBoardRepository } from '../../domain/ports/custom-board.repository.port';
import { CUSTOM_BOARD_REPOSITORY } from '../../domain/ports/custom-board.repository.port';
import { CustomBoard } from '../../domain/aggregates/custom-board.aggregate';
import { BoardLayout } from '../../domain/value-objects/board-layout.vo';
import { BoardName } from '../../domain/value-objects/board-name.vo';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { CreateCustomBoardInput } from '../dtos/create-custom-board.input';
import { CreateCustomBoardOutput } from '../dtos/create-custom-board.output';

@Injectable()
export class CreateCustomBoardUseCase {
  constructor(
    @Inject(CUSTOM_BOARD_REPOSITORY)
    private readonly customBoardRepository: ICustomBoardRepository,
  ) {}

  async execute(input: CreateCustomBoardInput): Promise<CreateCustomBoardOutput> {
    // Every rule lives in the domain: value objects validate their own
    // fields and CustomBoard.create validates the grid shape itself.
    const board = CustomBoard.create(
      UserId.create(input.authorId),
      BoardName.create(input.name),
      Difficulty.create(input.difficulty),
      BoardLayout.create(input.boardLayout),
    );

    await this.customBoardRepository.save(board);

    const output = new CreateCustomBoardOutput();
    output.id = board.getId().toString();
    output.name = board.getName().toString();
    output.difficulty = board.getDifficulty().getValue();
    output.boardLayout = board.getBoardLayout().toJson();
    output.createdAt = board.getCreatedAt().toISOString();
    return output;
  }
}
