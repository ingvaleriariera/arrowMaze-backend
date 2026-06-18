import { Inject, Injectable } from '@nestjs/common';
import type { IScoreRepository } from '../../domain/ports/score.repository.port';
import { SCORE_REPOSITORY } from '../../domain/ports/score.repository.port';
import type { IPlayerProgressRepository } from '../../domain/ports/player-progress.repository.port';
import { PLAYER_PROGRESS_REPOSITORY } from '../../domain/ports/player-progress.repository.port';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Score } from '../../domain/value-objects/score.vo';
import { ScoreEntry } from '../../domain/aggregates/score-entry.aggregate';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { LeaderboardPolicy } from '../../domain/leaderboard-policy';
import { SubmitScoreInput } from '../dtos/submit-score.input';
import { SubmitScoreOutput } from '../dtos/submit-score.output';

@Injectable()
export class SubmitScoreUseCase {
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(PLAYER_PROGRESS_REPOSITORY)
    private readonly progressRepository: IPlayerProgressRepository,
    @Inject('LEADERBOARD_POLICY')
    private readonly leaderboardPolicy: LeaderboardPolicy,
  ) {}

  async execute(input: SubmitScoreInput): Promise<SubmitScoreOutput> {
    const userId = UserId.create(input.userId);
    const levelId = LevelId.create(input.levelId);
    const score = Score.create(input.score);

    let progress = await this.progressRepository.findByUserId(userId);
    if (!progress) {
      progress = PlayerProgress.create(userId);
    }

    const currentBest = progress.getBestScore(levelId);
    const qualifies = this.leaderboardPolicy.qualifiesForLeaderboard(
      score,
      currentBest,
    );

    const scoreEntry = ScoreEntry.create(userId, levelId, score);
    await this.scoreRepository.save(scoreEntry);

    const output = new SubmitScoreOutput();
    output.accepted = true;
    output.qualifiedForLeaderboard = qualifies;
    return output;
  }
}
