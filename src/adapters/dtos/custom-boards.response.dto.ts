import { ApiProperty } from '@nestjs/swagger';
import { CustomBoardHttpDTO } from './custom-board-http.dto';

export class CustomBoardsResponseDto {
  @ApiProperty({
    type: [CustomBoardHttpDTO],
    description: 'Community boards, newest first',
  })
  boards: CustomBoardHttpDTO[];
}
