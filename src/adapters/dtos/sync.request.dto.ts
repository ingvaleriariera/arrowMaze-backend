import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class LevelProgressRequestDTO {
  @ApiProperty({
    example: 'level-001',
    description: 'Level identifier',
  })
  @IsString()
  levelId: string;

  @ApiProperty({
    example: 150,
    description: 'Best score for this level',
  })
  @IsInt()
  @IsPositive()
  bestScore: number;

  @ApiProperty({
    example: '2026-06-17T20:10:30.000Z',
    description: 'When the level was completed',
  })
  @IsString()
  completedAt: string;
}

export class SyncRequestDTO {
  @ApiProperty({
    type: [LevelProgressRequestDTO],
    description: 'Array of level progress to sync',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelProgressRequestDTO)
  levels: LevelProgressRequestDTO[];
}
