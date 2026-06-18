import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { ILevelDefinitionRepository } from '../../domain/ports/level-definition.repository.port';
import { LEVEL_DEFINITION_REPOSITORY } from '../../domain/ports/level-definition.repository.port';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { LevelConfigBuilder } from '../../adapters/builders/level-config.builder';
import { LEVELS_SEED } from './levels.data';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @Inject(LEVEL_DEFINITION_REPOSITORY)
    private readonly levelRepository: ILevelDefinitionRepository,
    private readonly levelConfigBuilder: LevelConfigBuilder,
  ) {}

  async seed(): Promise<void> {
    let seededCount = 0;

    for (const levelData of LEVELS_SEED) {
      const levelId = LevelId.create(levelData.id);
      const existingLevel = await this.levelRepository.findById(levelId);

      if (!existingLevel) {
        this.levelConfigBuilder
          .setId(levelData.id)
          .setDifficulty(levelData.difficulty)
          .setMoveLimit(levelData.moveLimit)
          .setBoardLayout(levelData.boardLayout);

        const level = this.levelConfigBuilder.build();
        await this.levelRepository.save(level);
        seededCount++;
        this.levelConfigBuilder.reset();
      }
    }

    this.logger.log(`Database seeding completed. ${seededCount} levels seeded.`);
  }
}
