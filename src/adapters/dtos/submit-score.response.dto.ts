import { ApiProperty } from '@nestjs/swagger';

export class SubmitScoreResponseDTO {
  @ApiProperty({
    example: true,
    description: 'Whether the score was accepted',
  })
  accepted: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether this score qualifies for the leaderboard',
  })
  qualifiedForLeaderboard: boolean;
}
