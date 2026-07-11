import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomBoardEntity } from '../orm/custom-board.entity';
import { CustomBoardController } from '../../adapters/controllers/custom-board.controller';
import { CreateCustomBoardUseCase } from '../../application/use-cases/create-custom-board.use-case';
import { GetCustomBoardsUseCase } from '../../application/use-cases/get-custom-boards.use-case';
import { CustomBoardRepositoryImpl } from '../../adapters/repositories/custom-board.repository.impl';
import { CustomBoardEntityMapper } from '../../adapters/mappers/custom-board-entity.mapper';
import { CustomBoardMapper } from '../../adapters/mappers/custom-board.mapper';
import { CUSTOM_BOARD_REPOSITORY } from '../../domain/ports/custom-board.repository.port';
// For JwtAuthGuard (create endpoint) and USER_REPOSITORY (author names).
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomBoardEntity]), AuthModule],
  controllers: [CustomBoardController],
  providers: [
    CreateCustomBoardUseCase,
    GetCustomBoardsUseCase,
    {
      provide: CUSTOM_BOARD_REPOSITORY,
      useClass: CustomBoardRepositoryImpl,
    },
    CustomBoardEntityMapper,
    CustomBoardMapper,
  ],
})
export class CustomBoardModule {}
