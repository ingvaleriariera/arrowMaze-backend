import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomBoardRequestDto {
  @ApiProperty({
    example: 'Mi laberinto',
    description: 'Display name for the board (3-30 characters)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty the board should be played at',
    enum: ['easy', 'medium', 'hard'],
  })
  @IsIn(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({
    example: '{"grid": [[1,1,0],[1,1,1],[0,1,1]], "rows": 3, "cols": 3}',
    description:
      'Board shape as JSON: rectangular 0/1 grid (1 = playable cell), same format as standard levels',
  })
  @IsString()
  boardLayout: string;
}
