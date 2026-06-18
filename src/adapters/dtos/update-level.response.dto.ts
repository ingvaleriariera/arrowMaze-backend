import { ApiProperty } from '@nestjs/swagger';

export class UpdateLevelResponseDTO {
  @ApiProperty({
    example: 'level-001',
    description: 'Updated level identifier',
  })
  levelId: string;

  @ApiProperty({
    example: 2,
    description: 'New version number',
  })
  version: number;
}
