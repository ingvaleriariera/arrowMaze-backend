import { Inject, Injectable } from '@nestjs/common';
import type { IScoreRepository } from '../../domain/ports/score.repository.port';
import { SCORE_REPOSITORY } from '../../domain/ports/score.repository.port';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { GetLeaderboardInput } from '../dtos/get-leaderboard.input';
import { GetLeaderboardOutput } from '../dtos/get-leaderboard.output';
import { LeaderboardEntryDTO } from '../dtos/leaderboard-entry.dto';

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetLeaderboardInput): Promise<GetLeaderboardOutput> {
    const levelId = LevelId.create(input.levelId);
    const scoreEntries = await this.scoreRepository.findTopByLevel(
      levelId,
      input.limit,
    );

    const entries: LeaderboardEntryDTO[] = [];

    for (let rank = 0; rank < scoreEntries.length; rank++) {
      const entry = scoreEntries[rank];
      const user = await this.userRepository.findById(entry.getUserId());
      const username = user ? user.getUsername().toString() : 'Unknown';

      const dto = new LeaderboardEntryDTO();
      dto.rank = rank + 1;
      dto.username = username;
      dto.score = entry.getScore().getValue();
      dto.achievedAt = entry.getAchievedAt().toISOString();
      entries.push(dto);
    }

    const output = new GetLeaderboardOutput();
    output.entries = entries;
    return output;
  }
}
