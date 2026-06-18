import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GetLeaderboardUseCase } from '../../application/use-cases/get-leaderboard.use-case';
import { LeaderboardMapper } from '../mappers/leaderboard.mapper';
import { LeaderboardResponseDTO } from '../dtos/leaderboard.response.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly leaderboardMapper: LeaderboardMapper,
  ) {}

  @Get(':levelId')
  @ApiOperation({ summary: 'Get global leaderboard for a level' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of entries (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponseDTO,
  })
  async getLeaderboard(
    @Param('levelId') levelId: string,
    @Query('limit') limit?: string,
  ): Promise<LeaderboardResponseDTO> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const input = this.leaderboardMapper.toGetLeaderboardInput(
      levelId,
      limitNumber,
    );
    const output = await this.getLeaderboardUseCase.execute(input);
    return this.leaderboardMapper.toLeaderboardResponse(output);
  }
}
