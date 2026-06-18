import { LevelId } from '../value-objects/level-id.vo';
import { Score } from '../value-objects/score.vo';

export class LevelProgress {
  private constructor(
    private readonly levelId: LevelId,
    private bestScore: Score,
    private readonly completedAt: Date,
  ) {}

  static create(levelId: LevelId, score: Score): LevelProgress {
    return new LevelProgress(levelId, score, new Date());
  }

  static reconstitute(
    levelId: LevelId,
    score: Score,
    completedAt: Date,
  ): LevelProgress {
    return new LevelProgress(levelId, score, completedAt);
  }

  getLevelId(): LevelId {
    return this.levelId;
  }

  getBestScore(): Score {
    return this.bestScore;
  }

  getCompletedAt(): Date {
    return this.completedAt;
  }

  updateScoreIfHigher(newScore: Score): void {
    if (newScore.isGreaterThan(this.bestScore)) {
      this.bestScore = newScore;
    }
  }
}
