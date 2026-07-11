import { Inject, Injectable } from '@nestjs/common';
import type { ICustomBoardRepository } from '../../domain/ports/custom-board.repository.port';
import { CUSTOM_BOARD_REPOSITORY } from '../../domain/ports/custom-board.repository.port';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { CustomBoardDTO } from '../dtos/custom-board.dto';
import { GetCustomBoardsOutput } from '../dtos/get-custom-boards.output';

@Injectable()
export class GetCustomBoardsUseCase {
  constructor(
    @Inject(CUSTOM_BOARD_REPOSITORY)
    private readonly customBoardRepository: ICustomBoardRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(limit: number): Promise<GetCustomBoardsOutput> {
    const boards = await this.customBoardRepository.findAll(limit);

    // Resolve author display names, deduplicating lookups per author —
    // same approach as the global leaderboard.
    const usernames = new Map<string, string>();
    const dtos: CustomBoardDTO[] = [];

    for (const board of boards) {
      const authorId = board.getAuthorId();
      const key = authorId.toString();
      if (!usernames.has(key)) {
        const user = await this.userRepository.findById(authorId);
        usernames.set(key, user ? user.getUsername().toString() : 'Unknown');
      }

      const dto = new CustomBoardDTO();
      dto.id = board.getId().toString();
      dto.name = board.getName().toString();
      dto.authorUsername = usernames.get(key)!;
      dto.difficulty = board.getDifficulty().getValue();
      dto.boardLayout = board.getBoardLayout().toJson();
      dto.createdAt = board.getCreatedAt().toISOString();
      dtos.push(dto);
    }

    const output = new GetCustomBoardsOutput();
    output.boards = dtos;
    return output;
  }
}
