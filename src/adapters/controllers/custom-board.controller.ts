import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomBoardUseCase } from '../../application/use-cases/create-custom-board.use-case';
import { GetCustomBoardsUseCase } from '../../application/use-cases/get-custom-boards.use-case';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CreateCustomBoardRequestDto } from '../dtos/create-custom-board.request.dto';
import { CreateCustomBoardResponseDto } from '../dtos/create-custom-board.response.dto';
import { CustomBoardsResponseDto } from '../dtos/custom-boards.response.dto';
import { CustomBoardMapper } from '../mappers/custom-board.mapper';

@ApiTags('custom-boards')
@Controller('custom-boards')
export class CustomBoardController {
  constructor(
    private readonly createCustomBoardUseCase: CreateCustomBoardUseCase,
    private readonly getCustomBoardsUseCase: GetCustomBoardsUseCase,
    private readonly customBoardMapper: CustomBoardMapper,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Publish a player-designed board shape' })
  @ApiResponse({
    status: 201,
    description: 'Board created',
    type: CreateCustomBoardResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid board (name/grid rules)' })
  @ApiResponse({ status: 401, description: 'Unauthorized - token required' })
  async create(
    @Request() req: any,
    @Body() dto: CreateCustomBoardRequestDto,
  ): Promise<CreateCustomBoardResponseDto> {
    try {
      const input = this.customBoardMapper.toCreateInput(req.user.userId, dto);
      const output = await this.createCustomBoardUseCase.execute(input);
      return this.customBoardMapper.toCreateResponse(output);
    } catch (error) {
      // Domain validation failures (grid shape, name length…) are client
      // errors, not 500s.
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List community boards, newest first' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Community boards',
    type: CustomBoardsResponseDto,
  })
  async list(@Query('limit') limit?: string): Promise<CustomBoardsResponseDto> {
    const parsed = limit !== undefined ? parseInt(limit, 10) : 50;
    const effectiveLimit =
      Number.isNaN(parsed) || parsed <= 0 ? 50 : Math.min(parsed, 100);
    const output = await this.getCustomBoardsUseCase.execute(effectiveLimit);
    return this.customBoardMapper.toBoardsResponse(output);
  }
}
