import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubmitScoreUseCase } from '../../application/use-cases/submit-score.use-case';
import { ScoreMapper } from '../mappers/score.mapper';
import { SubmitScoreRequestDTO } from '../dtos/submit-score.request.dto';
import { SubmitScoreResponseDTO } from '../dtos/submit-score.response.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';

@ApiTags('scores')
@Controller('scores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScoreController {
  constructor(
    private readonly submitScoreUseCase: SubmitScoreUseCase,
    private readonly scoreMapper: ScoreMapper,
  ) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a score for a level' })
  @ApiResponse({
    status: 200,
    description: 'Score submitted successfully',
    type: SubmitScoreResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - token required',
  })
  async submitScore(
    @Request() req: any,
    @Body() submitDto: SubmitScoreRequestDTO,
  ): Promise<SubmitScoreResponseDTO> {
    const userId = req.user.userId;
    const input = this.scoreMapper.toSubmitInput(userId, submitDto);
    const output = await this.submitScoreUseCase.execute(input);
    return this.scoreMapper.toSubmitResponse(output);
  }
}
