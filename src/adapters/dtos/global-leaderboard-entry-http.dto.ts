import { ApiProperty } from '@nestjs/swagger';

export class GlobalLeaderboardEntryHttpDTO {
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
    example: 850,
    description: "Sum of the player's best score across every level",
  })
  totalScore: number;
}
