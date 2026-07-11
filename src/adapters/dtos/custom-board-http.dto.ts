import { ApiProperty } from '@nestjs/swagger';

export class CustomBoardHttpDTO {
  @ApiProperty({ example: 'b5c3f8a2-1d4e-4f6a-9b8c-7e2d5a3f1c9b' })
  id: string;

  @ApiProperty({ example: 'Mi laberinto' })
  name: string;

  @ApiProperty({ example: 'player1' })
  authorUsername: string;

  @ApiProperty({ example: 'medium', enum: ['easy', 'medium', 'hard'] })
  difficulty: string;

  @ApiProperty({
    example: '{"grid": [[1,1,0],[1,1,1],[0,1,1]], "rows": 3, "cols": 3}',
    description: 'Board shape as a 0/1 grid JSON string',
  })
  boardLayout: string;

  @ApiProperty({ example: '2026-07-11T18:00:00.000Z' })
  createdAt: string;
}
