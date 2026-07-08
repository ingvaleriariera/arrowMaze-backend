import { Injectable } from '@nestjs/common';
import { IConflictResolver } from '../../application/ports/conflict-resolver.port';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { LevelId } from '../../domain/value-objects/level-id.vo';

@Injectable()
export class BestScoreConflictResolver implements IConflictResolver {
  resolve(local: PlayerProgress, remote: PlayerProgress): PlayerProgress {
    // Iterate through all levels in both local and remote
    const allLevels = new Map<string, boolean>();

    for (const level of local.getCompletedLevels()) {
      allLevels.set(level.getLevelId().toString(), true);
    }

    for (const level of remote.getCompletedLevels()) {
      allLevels.set(level.getLevelId().toString(), true);
    }

    // Create new progress starting from remote to preserve userId and other properties.
    // Coins aren't this resolver's concern — SyncProgressUseCase overwrites
    // them separately via setCoins() (last-write-wins, not max-based like
    // scores); carrying remote's value here just avoids an intermediate
    // zeroed state.
    const resolved = PlayerProgress.reconstitute(
      remote.getId(),
      remote.getUserId(),
      [],
      remote.getCoins(),
      remote.getUpdatedAt(),
    );

    // For each level, take the best score
    for (const levelIdStr of allLevels.keys()) {
      const levelId = LevelId.create(levelIdStr);
      const localScore = local.getBestScore(levelId);
      const remoteScore = remote.getBestScore(levelId);

      const bestScore = localScore.isGreaterThan(remoteScore)
        ? localScore
        : remoteScore;

      resolved.recordCompletion(levelId, bestScore);
    }

    return resolved;
  }
}
