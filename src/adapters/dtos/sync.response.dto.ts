import { ApiProperty } from '@nestjs/swagger';
import { LevelProgressHttpDTO } from './level-progress-http.dto';

export class SyncResponseDTO {
  @ApiProperty({
    type: [LevelProgressHttpDTO],
    description: 'Synced level progress after conflict resolution',
  })
  levels: LevelProgressHttpDTO[];

  @ApiProperty({
    example: 250,
    description: "Player's coin balance as persisted by the server",
  })
  coins: number;
}
