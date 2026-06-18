import { Inject, Injectable } from '@nestjs/common';
import type { ILevelDefinitionRepository } from '../../domain/ports/level-definition.repository.port';
import { LEVEL_DEFINITION_REPOSITORY } from '../../domain/ports/level-definition.repository.port';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';
import { GetLevelsInput } from '../dtos/get-levels.input';
import { GetLevelsOutput } from '../dtos/get-levels.output';
import { LevelSummaryDTO } from '../dtos/level-summary.dto';

@Injectable()
export class GetLevelsUseCase {
  constructor(
    @Inject(LEVEL_DEFINITION_REPOSITORY)
    private readonly levelRepository: ILevelDefinitionRepository,
  ) {}

  async execute(input: GetLevelsInput): Promise<GetLevelsOutput> {
    let levels;

    if (input.difficulty) {
      const difficulty = Difficulty.create(input.difficulty);
      levels = await this.levelRepository.findByDifficulty(difficulty);
    } else {
      levels = await this.levelRepository.findAll();
    }

    const levelSummaries = levels.map((level) => {
      const summary = new LevelSummaryDTO();
      summary.id = level.getId().toString();
      summary.difficulty = level.getDifficulty().getValue();
      summary.moveLimit = level.getMoveLimit().getValue();
      summary.boardLayout = level.getBoardLayout().toJson();
      summary.version = level.getVersion();
      return summary;
    });

    const output = new GetLevelsOutput();
    output.levels = levelSummaries;
    return output;
  }
}
