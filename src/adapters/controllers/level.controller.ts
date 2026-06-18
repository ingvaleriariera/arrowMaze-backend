import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetLevelsUseCase } from '../../application/use-cases/get-levels.use-case';
import { UpdateLevelConfigurationUseCase } from '../../application/use-cases/update-level-configuration.use-case';
import { LevelMapper } from '../mappers/level.mapper';
import { LevelsResponseDTO } from '../dtos/levels.response.dto';
import { UpdateLevelRequestDTO } from '../dtos/update-level.request.dto';
import { UpdateLevelResponseDTO } from '../dtos/update-level.response.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../../infrastructure/guards/admin-role.guard';
import { GetLevelsInput } from '../../application/dtos/get-levels.input';

@ApiTags('levels')
@Controller('levels')
export class LevelController {
  constructor(
    private readonly getLevelsUseCase: GetLevelsUseCase,
    private readonly updateLevelConfigurationUseCase: UpdateLevelConfigurationUseCase,
    private readonly levelMapper: LevelMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all levels' })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['easy', 'medium', 'hard'],
    description: 'Filter levels by difficulty',
  })
  @ApiResponse({
    status: 200,
    description: 'List of levels retrieved successfully',
    type: LevelsResponseDTO,
  })
  async getAllLevels(
    @Query('difficulty') difficulty?: string,
  ): Promise<LevelsResponseDTO> {
    const input = new GetLevelsInput();
    input.difficulty = difficulty;

    const output = await this.getLevelsUseCase.execute(input);
    return this.levelMapper.toLevelsResponse(output);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update level configuration (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Level updated successfully',
    type: UpdateLevelResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Level not found',
  })
  async updateLevel(
    @Param('id') levelId: string,
    @Body() updateDto: UpdateLevelRequestDTO,
  ): Promise<UpdateLevelResponseDTO> {
    try {
      const input = this.levelMapper.toUpdateInput(levelId, updateDto);
      const output = await this.updateLevelConfigurationUseCase.execute(input);
      return this.levelMapper.toUpdateResponse(output);
    } catch (error) {
      if (error instanceof Error && error.message === 'Level not found') {
        throw new NotFoundException('Level not found');
      }
      throw error;
    }
  }
}
