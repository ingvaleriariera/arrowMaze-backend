import { Inject, Injectable } from '@nestjs/common';
import type { IPlayerProgressRepository } from '../../domain/ports/player-progress.repository.port';
import { PLAYER_PROGRESS_REPOSITORY } from '../../domain/ports/player-progress.repository.port';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { GetGlobalLeaderboardInput } from '../dtos/get-global-leaderboard.input';
import { GetGlobalLeaderboardOutput } from '../dtos/get-global-leaderboard.output';
import { GlobalLeaderboardEntryDTO } from '../dtos/global-leaderboard-entry.dto';

@Injectable()
export class GetGlobalLeaderboardUseCase {
  constructor(
    @Inject(PLAYER_PROGRESS_REPOSITORY)
    private readonly progressRepository: IPlayerProgressRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: GetGlobalLeaderboardInput,
  ): Promise<GetGlobalLeaderboardOutput> {
    const allProgress = await this.progressRepository.findAll();

    // PlayerProgress.levels already holds one deduplicated best score per
    // level (see LevelProgress.updateScoreIfHigher) — summing that is the
    // correct "total points across all levels". Summing score_entries
    // directly would double-count replays, since every submitScore() call
    // appends a new row there instead of updating one.
    const totals = allProgress
      .map((progress) => ({
        userId: progress.getUserId(),
        totalScore: Array.from(progress.getCompletedLevels()).reduce(
          (sum, level) => sum + level.getBestScore().getValue(),
          0,
        ),
      }))
      .filter((entry) => entry.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, input.limit);

    const entries: GlobalLeaderboardEntryDTO[] = [];

    for (let rank = 0; rank < totals.length; rank++) {
      const { userId, totalScore } = totals[rank];
      const user = await this.userRepository.findById(userId);
      const username = user ? user.getUsername().toString() : 'Unknown';

      const dto = new GlobalLeaderboardEntryDTO();
      dto.rank = rank + 1;
      dto.username = username;
      dto.totalScore = totalScore;
      entries.push(dto);
    }

    const output = new GetGlobalLeaderboardOutput();
    output.entries = entries;
    return output;
  }
}
