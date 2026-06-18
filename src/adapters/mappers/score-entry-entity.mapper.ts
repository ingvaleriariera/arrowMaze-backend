import { Injectable } from '@nestjs/common';
import { ScoreEntryEntity } from '../../infrastructure/orm/score-entry.entity';
import { ScoreEntry } from '../../domain/aggregates/score-entry.aggregate';
import { ScoreEntryId } from '../../domain/value-objects/score-entry-id.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Score } from '../../domain/value-objects/score.vo';

@Injectable()
export class ScoreEntryEntityMapper {
  toDomain(entity: ScoreEntryEntity): ScoreEntry {
    const id = ScoreEntryId.create(entity.id);
    const userId = UserId.create(entity.userId);
    const levelId = LevelId.create(entity.levelId);
    const score = Score.create(entity.score);
    const achievedAt = new Date(entity.achievedAt);

    return ScoreEntry.reconstitute(id, userId, levelId, score, achievedAt);
  }

  toPersistence(entry: ScoreEntry): ScoreEntryEntity {
    const entity = new ScoreEntryEntity();
    entity.id = entry.getId().toString();
    entity.userId = entry.getUserId().toString();
    entity.levelId = entry.getLevelId().toString();
    entity.score = entry.getScore().getValue();
    entity.achievedAt = entry.getAchievedAt();
    return entity;
  }
}
