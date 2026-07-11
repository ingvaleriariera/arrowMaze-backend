import { Injectable } from '@nestjs/common';
import { CustomBoard } from '../../domain/aggregates/custom-board.aggregate';
import { BoardLayout } from '../../domain/value-objects/board-layout.vo';
import { BoardName } from '../../domain/value-objects/board-name.vo';
import { CustomBoardId } from '../../domain/value-objects/custom-board-id.vo';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { CustomBoardEntity } from '../../infrastructure/orm/custom-board.entity';

@Injectable()
export class CustomBoardEntityMapper {
  toDomain(entity: CustomBoardEntity): CustomBoard {
    return CustomBoard.reconstitute(
      CustomBoardId.create(entity.id),
      UserId.create(entity.authorId),
      BoardName.create(entity.name),
      Difficulty.create(entity.difficulty),
      BoardLayout.create(entity.boardLayout),
      entity.createdAt,
    );
  }

  toPersistence(board: CustomBoard): CustomBoardEntity {
    const entity = new CustomBoardEntity();
    entity.id = board.getId().toString();
    entity.authorId = board.getAuthorId().toString();
    entity.name = board.getName().toString();
    entity.difficulty = board.getDifficulty().getValue();
    entity.boardLayout = board.getBoardLayout().toJson();
    entity.createdAt = board.getCreatedAt();
    return entity;
  }
}
