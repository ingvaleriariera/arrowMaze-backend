import { Injectable } from '@nestjs/common';
import { SyncRequestDTO } from '../dtos/sync.request.dto';
import { SyncResponseDTO } from '../dtos/sync.response.dto';
import { LevelProgressHttpDTO } from '../dtos/level-progress-http.dto';
import { SyncProgressInput } from '../../application/dtos/sync-progress.input';
import { SyncProgressOutput } from '../../application/dtos/sync-progress.output';
import { LevelProgressDTO } from '../../application/dtos/level-progress.dto';

@Injectable()
export class ProgressMapper {
  toSyncInput(userId: string, dto: SyncRequestDTO): SyncProgressInput {
    const input = new SyncProgressInput();
    input.userId = userId;
    input.levels = dto.levels.map((level) => {
      const levelProgressDto = new LevelProgressDTO();
      levelProgressDto.levelId = level.levelId;
      levelProgressDto.bestScore = level.bestScore;
      levelProgressDto.completedAt = level.completedAt;
      return levelProgressDto;
    });
    return input;
  }

  toSyncResponse(output: SyncProgressOutput): SyncResponseDTO {
    const response = new SyncResponseDTO();
    response.levels = output.levels.map((level) => {
      const httpDto = new LevelProgressHttpDTO();
      httpDto.levelId = level.levelId;
      httpDto.bestScore = level.bestScore;
      httpDto.completedAt = level.completedAt;
      return httpDto;
    });
    return response;
  }
}
