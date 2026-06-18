import { Inject, Injectable } from '@nestjs/common';
import type { ILevelDefinitionRepository } from '../../domain/ports/level-definition.repository.port';
import { LEVEL_DEFINITION_REPOSITORY } from '../../domain/ports/level-definition.repository.port';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { BoardLayout } from '../../domain/value-objects/board-layout.vo';
import { MoveLimit } from '../../domain/value-objects/move-limit.vo';
import { UpdateLevelInput } from '../dtos/update-level.input';
import { UpdateLevelOutput } from '../dtos/update-level.output';

@Injectable()
export class UpdateLevelConfigurationUseCase {
  constructor(
    @Inject(LEVEL_DEFINITION_REPOSITORY)
    private readonly levelRepository: ILevelDefinitionRepository,
  ) {}

  async execute(input: UpdateLevelInput): Promise<UpdateLevelOutput> {
    const levelId = LevelId.create(input.levelId);
    const level = await this.levelRepository.findById(levelId);

    if (!level) {
      throw new Error('Level not found');
    }

    if (input.boardLayout) {
      const newLayout = BoardLayout.create(input.boardLayout);
      level.updateLayout(newLayout);
    }

    if (input.moveLimit !== undefined) {
      const newLimit = MoveLimit.create(input.moveLimit);
      level.updateMoveLimit(newLimit);
    }

    await this.levelRepository.save(level);

    const output = new UpdateLevelOutput();
    output.levelId = level.getId().toString();
    output.version = level.getVersion();
    return output;
  }
}
