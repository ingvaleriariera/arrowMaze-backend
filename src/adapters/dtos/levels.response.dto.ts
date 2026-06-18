import { ApiProperty } from '@nestjs/swagger';
import { LevelHttpDTO } from './level-http.dto';

export class LevelsResponseDTO {
  @ApiProperty({
    type: [LevelHttpDTO],
    description: 'List of level definitions',
  })
  levels: LevelHttpDTO[];
}
