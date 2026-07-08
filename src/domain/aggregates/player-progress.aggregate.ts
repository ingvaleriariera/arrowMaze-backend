import { ProgressId } from '../value-objects/progress-id.vo';
import { UserId } from '../value-objects/user-id.vo';
import { LevelId } from '../value-objects/level-id.vo';
import { Score } from '../value-objects/score.vo';
import { Coins } from '../value-objects/coins.vo';
import { LevelProgress } from './level-progress.entity';

export class PlayerProgress {
  private constructor(
    private readonly id: ProgressId,
    private readonly userId: UserId,
    private readonly levels: LevelProgress[],
    private coins: Coins,
    private updatedAt: Date,
  ) {}

  static create(userId: UserId): PlayerProgress {
    return new PlayerProgress(
      ProgressId.generate(),
      userId,
      [],
      // Matches the client's own GameProgress default (see game_progress.dart)
      // — a generous starting balance so power-ups can be tested freely
      // before a real coin economy (earning/pricing) is in place. TODO:
      // revisit once that's designed for real players.
      Coins.create(9999),
      new Date(),
    );
  }

  static reconstitute(
    id: ProgressId,
    userId: UserId,
    levels: LevelProgress[],
    coins: Coins,
    updatedAt: Date,
  ): PlayerProgress {
    return new PlayerProgress(id, userId, levels, coins, updatedAt);
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

  getCoins(): Coins {
    return this.coins;
  }

  // Deliberately a direct setter, not routed through IConflictResolver like
  // level scores are: coins are a spendable balance that legitimately goes
  // down, while the score resolver always keeps the higher of two values —
  // that would make spending impossible to ever persist.
  setCoins(coins: Coins): void {
    this.coins = coins;
    this.updatedAt = new Date();
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
