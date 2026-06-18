import { Injectable } from '@nestjs/common';
import { PlayerProgressEntity } from '../../infrastructure/orm/player-progress.entity';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { ProgressId } from '../../domain/value-objects/progress-id.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Score } from '../../domain/value-objects/score.vo';
import { LevelProgress } from '../../domain/aggregates/level-progress.entity';

@Injectable()
export class PlayerProgressEntityMapper {
  toDomain(entity: PlayerProgressEntity): PlayerProgress {
    const id = ProgressId.create(entity.id);
    const userId = UserId.create(entity.userId);

    const levels = entity.levels.map((levelEmbedded) => {
      const levelId = LevelId.create(levelEmbedded.levelId);
      const score = Score.create(levelEmbedded.bestScore);
      const completedAt = new Date(levelEmbedded.completedAt);
      return LevelProgress.reconstitute(levelId, score, completedAt);
    });

    return PlayerProgress.reconstitute(id, userId, levels, entity.updatedAt);
  }

  toPersistence(progress: PlayerProgress): PlayerProgressEntity {
    const entity = new PlayerProgressEntity();
    entity.id = progress.getId().toString();
    entity.userId = progress.getUserId().toString();
    entity.updatedAt = progress.getUpdatedAt();
    entity.levels = Array.from(progress.getCompletedLevels()).map((level) => ({
      levelId: level.getLevelId().toString(),
      bestScore: level.getBestScore().getValue(),
      completedAt: level.getCompletedAt().toISOString(),
    }));
    return entity;
  }
}
