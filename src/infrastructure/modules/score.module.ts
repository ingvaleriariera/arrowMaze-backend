import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntryEntity } from '../entities/score-entry.entity';
import { ScoreController } from '../../adapters/controllers/score.controller';
import { SubmitScoreUseCase } from '../../application/use-cases/submit-score.use-case';
import { ScoreRepositoryImpl } from '../../adapters/repositories/score.repository.impl';
import { ScoreEntryEntityMapper } from '../../adapters/mappers/score-entry-entity.mapper';
import { ScoreMapper } from '../../adapters/mappers/score.mapper';
import { LeaderboardPolicy } from '../../domain/leaderboard-policy';
import { SCORE_REPOSITORY } from '../../domain/ports/score.repository.port';
import { AuthModule } from './auth.module';
import { ProgressModule } from './progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreEntryEntity]),
    AuthModule,
    ProgressModule,
  ],
  controllers: [ScoreController],
  providers: [
    SubmitScoreUseCase,
    {
      provide: SCORE_REPOSITORY,
      useClass: ScoreRepositoryImpl,
    },
    {
      provide: 'LEADERBOARD_POLICY',
      useClass: LeaderboardPolicy,
    },
    ScoreEntryEntityMapper,
    ScoreMapper,
  ],
})
export class ScoreModule {}
