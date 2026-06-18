import { ApiProperty } from '@nestjs/swagger';
import { LeaderboardEntryHttpDTO } from './leaderboard-entry-http.dto';

export class LeaderboardResponseDTO {
  @ApiProperty({
    type: [LeaderboardEntryHttpDTO],
    description: 'Leaderboard entries ranked by score',
  })
  entries: LeaderboardEntryHttpDTO[];
}
