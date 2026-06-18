import { ProgressId } from '../value-objects/progress-id.vo';
import { UserId } from '../value-objects/user-id.vo';
import { LevelId } from '../value-objects/level-id.vo';
import { Score } from '../value-objects/score.vo';
import { LevelProgress } from './level-progress.entity';

export class PlayerProgress {
  private constructor(
    private readonly id: ProgressId,
    private readonly userId: UserId,
    private readonly levels: LevelProgress[],
    private updatedAt: Date,
  ) {}

  static create(userId: UserId): PlayerProgress {
    return new PlayerProgress(
      ProgressId.generate(),
      userId,
      [],
      new Date(),
    );
  }

  static reconstitute(
    id: ProgressId,
    userId: UserId,
    levels: LevelProgress[],
    updatedAt: Date,
  ): PlayerProgress {
    return new PlayerProgress(id, userId, levels, updatedAt);
  }

  getId(): ProgressId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  recordCompletion(levelId: LevelId, score: Score): void {
    const existingLevel = this.levels.find((lp) =>
      lp.getLevelId().equals(levelId),
    );

    if (existingLevel) {
      existingLevel.updateScoreIfHigher(score);
    } else {
      const newLevel = LevelProgress.create(levelId, score);
      this.levels.push(newLevel);
    }

    this.updatedAt = new Date();
  }

  getBestScore(levelId: LevelId): Score {
    const levelProgress = this.levels.find((lp) =>
      lp.getLevelId().equals(levelId),
    );
    return levelProgress ? levelProgress.getBestScore() : Score.create(0);
  }

  isLevelCompleted(levelId: LevelId): boolean {
    return this.levels.some((lp) => lp.getLevelId().equals(levelId));
  }

  getCompletedLevels(): ReadonlyArray<LevelProgress> {
    return Object.freeze([...this.levels]);
  }
}
