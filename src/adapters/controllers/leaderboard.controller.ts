import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GetLeaderboardUseCase } from '../../application/use-cases/get-leaderboard.use-case';
import { GetGlobalLeaderboardUseCase } from '../../application/use-cases/get-global-leaderboard.use-case';
import { LeaderboardMapper } from '../mappers/leaderboard.mapper';
import { LeaderboardResponseDTO } from '../dtos/leaderboard.response.dto';
import { GlobalLeaderboardResponseDTO } from '../dtos/global-leaderboard.response.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly getGlobalLeaderboardUseCase: GetGlobalLeaderboardUseCase,
    private readonly leaderboardMapper: LeaderboardMapper,
  ) {}

  // Must come before @Get(':levelId') — NestJS matches routes in
  // declaration order within a controller, and a static "global" segment
  // needs to win over the dynamic :levelId param, or every request here
  // would be (wrongly) treated as levelId="global".
  @Get('global')
  @ApiOperation({ summary: 'Get the global leaderboard (total score across all levels)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of entries (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Global leaderboard retrieved successfully',
    type: GlobalLeaderboardResponseDTO,
  })
  async getGlobalLeaderboard(
    @Query('limit') limit?: string,
  ): Promise<GlobalLeaderboardResponseDTO> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const input = this.leaderboardMapper.toGetGlobalLeaderboardInput(limitNumber);
    const output = await this.getGlobalLeaderboardUseCase.execute(input);
    return this.leaderboardMapper.toGlobalLeaderboardResponse(output);
  }

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
