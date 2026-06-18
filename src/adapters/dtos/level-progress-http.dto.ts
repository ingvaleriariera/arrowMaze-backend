import { ApiProperty } from '@nestjs/swagger';

export class LevelProgressHttpDTO {
  @ApiProperty({
    example: 'level-001',
    description: 'Level identifier',
  })
  levelId: string;

  @ApiProperty({
    example: 150,
    description: 'Best score achieved for this level',
  })
  bestScore: number;

  @ApiProperty({
    example: '2026-06-17T20:10:30.000Z',
    description: 'ISO timestamp when level was completed',
  })
  completedAt: string;
}
