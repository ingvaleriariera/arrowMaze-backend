import { ScoreEntryId } from '../value-objects/score-entry-id.vo';
import { UserId } from '../value-objects/user-id.vo';
import { LevelId } from '../value-objects/level-id.vo';
import { Score } from '../value-objects/score.vo';

export class ScoreEntry {
  private constructor(
    private readonly id: ScoreEntryId,
    private readonly userId: UserId,
    private readonly levelId: LevelId,
    private readonly score: Score,
    private readonly achievedAt: Date,
  ) {}

  static create(
    userId: UserId,
    levelId: LevelId,
    score: Score,
  ): ScoreEntry {
    return new ScoreEntry(
      ScoreEntryId.generate(),
      userId,
      levelId,
      score,
      new Date(),
    );
  }

  static reconstitute(
    id: ScoreEntryId,
    userId: UserId,
    levelId: LevelId,
    score: Score,
    achievedAt: Date,
  ): ScoreEntry {
    return new ScoreEntry(id, userId, levelId, score, achievedAt);
  }

  getId(): ScoreEntryId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getLevelId(): LevelId {
    return this.levelId;
  }

  getScore(): Score {
    return this.score;
  }

  getAchievedAt(): Date {
    return this.achievedAt;
  }
}
