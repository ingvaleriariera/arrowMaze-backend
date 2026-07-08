import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntryEntity } from '../orm/score-entry.entity';
import { LeaderboardController } from '../../adapters/controllers/leaderboard.controller';
import { GetLeaderboardUseCase } from '../../application/use-cases/get-leaderboard.use-case';
import { GetGlobalLeaderboardUseCase } from '../../application/use-cases/get-global-leaderboard.use-case';
import { ScoreRepositoryImpl } from '../../adapters/repositories/score.repository.impl';
import { ScoreEntryEntityMapper } from '../../adapters/mappers/score-entry-entity.mapper';
import { LeaderboardMapper } from '../../adapters/mappers/leaderboard.mapper';
import { SCORE_REPOSITORY } from '../../domain/ports/score.repository.port';
import { AuthModule } from './auth.module';
import { ProgressModule } from './progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreEntryEntity]),
    AuthModule,
    // For PLAYER_PROGRESS_REPOSITORY — the global leaderboard sums each
    // player's best-score-per-level, which lives in PlayerProgress, not
    // in the (append-only) score_entries table.
    ProgressModule,
  ],
  controllers: [LeaderboardController],
  providers: [
    GetLeaderboardUseCase,
    GetGlobalLeaderboardUseCase,
    {
      provide: SCORE_REPOSITORY,
      useClass: ScoreRepositoryImpl,
    },
    ScoreEntryEntityMapper,
    LeaderboardMapper,
  ],
})
export class LeaderboardModule {}
