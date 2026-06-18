import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateLevelRequestDTO {
  @ApiProperty({
    example: '{"grid":[[1,2],[3,4]],"rows":2,"cols":2}',
    description: 'New board layout as JSON string (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  boardLayout?: string;

  @ApiProperty({
    example: 12,
    description: 'New move limit (optional)',
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  moveLimit?: number;
}
