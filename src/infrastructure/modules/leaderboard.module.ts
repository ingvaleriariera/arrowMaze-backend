import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntryEntity } from '../entities/score-entry.entity';
import { LeaderboardController } from '../../adapters/controllers/leaderboard.controller';
import { GetLeaderboardUseCase } from '../../application/use-cases/get-leaderboard.use-case';
import { ScoreRepositoryImpl } from '../../adapters/repositories/score.repository.impl';
import { ScoreEntryEntityMapper } from '../../adapters/mappers/score-entry-entity.mapper';
import { LeaderboardMapper } from '../../adapters/mappers/leaderboard.mapper';
import { SCORE_REPOSITORY } from '../../domain/ports/score.repository.port';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreEntryEntity]),
    AuthModule,
  ],
  controllers: [LeaderboardController],
  providers: [
    GetLeaderboardUseCase,
    {
      provide: SCORE_REPOSITORY,
      useClass: ScoreRepositoryImpl,
    },
    ScoreEntryEntityMapper,
    LeaderboardMapper,
  ],
})
export class LeaderboardModule {}
