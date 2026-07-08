import { ApiProperty } from '@nestjs/swagger';
import { GlobalLeaderboardEntryHttpDTO } from './global-leaderboard-entry-http.dto';

export class GlobalLeaderboardResponseDTO {
  @ApiProperty({
    type: [GlobalLeaderboardEntryHttpDTO],
    description: 'Players ranked by total score across all levels',
  })
  entries: GlobalLeaderboardEntryHttpDTO[];
}
