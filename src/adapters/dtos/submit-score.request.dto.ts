import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class SubmitScoreRequestDTO {
  @ApiProperty({
    example: 'level-001',
    description: 'Level identifier',
  })
  @IsString()
  levelId: string;

  @ApiProperty({
    example: 150,
    description: 'Score achieved',
  })
  @IsInt()
  @Min(0)
  score: number;
}
