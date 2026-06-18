import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelDefinitionEntity } from '../orm/level-definition.entity';
import { LevelController } from '../../adapters/controllers/level.controller';
import { GetLevelsUseCase } from '../../application/use-cases/get-levels.use-case';
import { UpdateLevelConfigurationUseCase } from '../../application/use-cases/update-level-configuration.use-case';
import { LevelDefinitionRepositoryImpl } from '../../adapters/repositories/level-definition.repository.impl';
import { LevelDefinitionEntityMapper } from '../../adapters/mappers/level-definition-entity.mapper';
import { LevelMapper } from '../../adapters/mappers/level.mapper';
import { LevelConfigBuilder } from '../../adapters/builders/level-config.builder';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { DatabaseSeeder } from '../seeders/database.seeder';
import { LEVEL_DEFINITION_REPOSITORY } from '../../domain/ports/level-definition.repository.port';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LevelDefinitionEntity]),
    AuthModule,
  ],
  controllers: [LevelController],
  providers: [
    GetLevelsUseCase,
    UpdateLevelConfigurationUseCase,
    {
      provide: LEVEL_DEFINITION_REPOSITORY,
      useClass: LevelDefinitionRepositoryImpl,
    },
    LevelDefinitionEntityMapper,
    LevelMapper,
    LevelConfigBuilder,
    AdminRoleGuard,
    DatabaseSeeder,
  ],
  exports: [DatabaseSeeder],
})
export class LevelModule {}
