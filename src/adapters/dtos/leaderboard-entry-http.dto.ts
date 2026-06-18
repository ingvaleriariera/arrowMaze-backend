import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryHttpDTO {
  @ApiProperty({
    example: 1,
    description: 'Rank position',
  })
  rank: number;

  @ApiProperty({
    example: 'johnDoe',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: 150,
    description: 'Score achieved',
  })
  score: number;

  @ApiProperty({
    example: '2026-06-17T20:10:30.000Z',
    description: 'ISO timestamp when score was achieved',
  })
  achievedAt: string;
}
