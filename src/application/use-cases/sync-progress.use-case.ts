import { Inject, Injectable } from '@nestjs/common';
import type { IPlayerProgressRepository } from '../../domain/ports/player-progress.repository.port';
import { PLAYER_PROGRESS_REPOSITORY } from '../../domain/ports/player-progress.repository.port';
import type { IConflictResolver } from '../ports/conflict-resolver.port';
import { CONFLICT_RESOLVER } from '../ports/conflict-resolver.port';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Score } from '../../domain/value-objects/score.vo';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { SyncProgressInput } from '../dtos/sync-progress.input';
import { SyncProgressOutput } from '../dtos/sync-progress.output';
import { LevelProgressDTO } from '../dtos/level-progress.dto';

@Injectable()
export class SyncProgressUseCase {
  constructor(
    @Inject(PLAYER_PROGRESS_REPOSITORY)
    private readonly progressRepository: IPlayerProgressRepository,
    @Inject(CONFLICT_RESOLVER)
    private readonly conflictResolver: IConflictResolver,
  ) {}

  async execute(input: SyncProgressInput): Promise<SyncProgressOutput> {
    const userId = UserId.create(input.userId);

    let remoteProgress = await this.progressRepository.findByUserId(userId);
    if (!remoteProgress) {
      remoteProgress = PlayerProgress.create(userId);
    }

    const localProgress = PlayerProgress.create(userId);
    for (const levelDto of input.levels) {
      const levelId = LevelId.create(levelDto.levelId);
      const score = Score.create(levelDto.bestScore);
      localProgress.recordCompletion(levelId, score);
    }

    const resolvedProgress = this.conflictResolver.resolve(
      localProgress,
      remoteProgress,
    );

    await this.progressRepository.save(resolvedProgress);

    const levelProgressDtos = Array.from(
      resolvedProgress.getCompletedLevels(),
    ).map((level) => {
      const dto = new LevelProgressDTO();
      dto.levelId = level.getLevelId().toString();
      dto.bestScore = level.getBestScore().getValue();
      dto.completedAt = level.getCompletedAt().toISOString();
      return dto;
    });

    const output = new SyncProgressOutput();
    output.levels = levelProgressDtos;
    return output;
  }
}
