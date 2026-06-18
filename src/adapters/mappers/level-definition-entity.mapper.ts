import { Injectable } from '@nestjs/common';
import { LevelDefinitionEntity } from '../../infrastructure/orm/level-definition.entity';
import { LevelDefinition } from '../../domain/aggregates/level-definition.aggregate';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { MoveLimit } from '../../domain/value-objects/move-limit.vo';
import { BoardLayout } from '../../domain/value-objects/board-layout.vo';

@Injectable()
export class LevelDefinitionEntityMapper {
  toDomain(entity: LevelDefinitionEntity): LevelDefinition {
    const id = LevelId.create(entity.id);
    const difficulty = Difficulty.create(entity.difficulty);
    const moveLimit = MoveLimit.create(entity.moveLimit);
    const boardLayout = BoardLayout.create(entity.boardLayout);

    return LevelDefinition.reconstitute(
      id,
      difficulty,
      moveLimit,
      boardLayout,
      entity.version,
    );
  }

  toPersistence(level: LevelDefinition): LevelDefinitionEntity {
    const entity = new LevelDefinitionEntity();
    entity.id = level.getId().toString();
    entity.difficulty = level.getDifficulty().getValue();
    entity.moveLimit = level.getMoveLimit().getValue();
    entity.boardLayout = level.getBoardLayout().toJson();
    entity.version = level.getVersion();
    return entity;
  }
}
