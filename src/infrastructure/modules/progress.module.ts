import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerProgressEntity } from '../entities/player-progress.entity';
import { ProgressController } from '../../adapters/controllers/progress.controller';
import { SyncProgressUseCase } from '../../application/use-cases/sync-progress.use-case';
import { PlayerProgressRepositoryImpl } from '../../adapters/repositories/player-progress.repository.impl';
import { PlayerProgressEntityMapper } from '../../adapters/mappers/player-progress-entity.mapper';
import { ProgressMapper } from '../../adapters/mappers/progress.mapper';
import { BestScoreConflictResolver } from '../../adapters/services/best-score-conflict-resolver';
import { PLAYER_PROGRESS_REPOSITORY } from '../../domain/ports/player-progress.repository.port';
import { CONFLICT_RESOLVER } from '../../application/ports/conflict-resolver.port';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerProgressEntity]),
    AuthModule,
  ],
  controllers: [ProgressController],
  providers: [
    SyncProgressUseCase,
    {
      provide: PLAYER_PROGRESS_REPOSITORY,
      useClass: PlayerProgressRepositoryImpl,
    },
    {
      provide: CONFLICT_RESOLVER,
      useClass: BestScoreConflictResolver,
    },
    PlayerProgressEntityMapper,
    ProgressMapper,
  ],
  exports: [PLAYER_PROGRESS_REPOSITORY],
})
export class ProgressModule {}
