import { ApiProperty } from '@nestjs/swagger';

export class LevelHttpDTO {
  @ApiProperty({
    example: 'level-001',
    description: 'Unique level identifier',
  })
  id: string;

  @ApiProperty({
    example: 'easy',
    description: 'Difficulty level',
    enum: ['easy', 'medium', 'hard'],
  })
  difficulty: string;

  @ApiProperty({
    example: 15,
    description: 'Maximum number of moves allowed',
  })
  moveLimit: number;

  @ApiProperty({
    example: '{"grid":[[1,2],[3,4]],"rows":2,"cols":2}',
    description: 'Board layout as JSON string',
  })
  boardLayout: string;

  @ApiProperty({
    example: 1,
    description: 'Version number',
  })
  version: number;
}
