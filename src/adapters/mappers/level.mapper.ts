import { Injectable } from '@nestjs/common';
import { UpdateLevelRequestDTO } from '../dtos/update-level.request.dto';
import { UpdateLevelResponseDTO } from '../dtos/update-level.response.dto';
import { LevelsResponseDTO } from '../dtos/levels.response.dto';
import { LevelHttpDTO } from '../dtos/level-http.dto';
import { UpdateLevelInput } from '../../application/dtos/update-level.input';
import { UpdateLevelOutput } from '../../application/dtos/update-level.output';
import { GetLevelsOutput } from '../../application/dtos/get-levels.output';

@Injectable()
export class LevelMapper {
  toUpdateInput(levelId: string, dto: UpdateLevelRequestDTO): UpdateLevelInput {
    const input = new UpdateLevelInput();
    input.levelId = levelId;
    input.boardLayout = dto.boardLayout;
    input.moveLimit = dto.moveLimit;
    return input;
  }

  toUpdateResponse(output: UpdateLevelOutput): UpdateLevelResponseDTO {
    const response = new UpdateLevelResponseDTO();
    response.levelId = output.levelId;
    response.version = output.version;
    return response;
  }

  toLevelsResponse(output: GetLevelsOutput): LevelsResponseDTO {
    const response = new LevelsResponseDTO();
    response.levels = output.levels.map((summary) => {
      const dto = new LevelHttpDTO();
      dto.id = summary.id;
      dto.difficulty = summary.difficulty;
      dto.moveLimit = summary.moveLimit;
      dto.boardLayout = summary.boardLayout;
      dto.version = summary.version;
      return dto;
    });
    return response;
  }
}
