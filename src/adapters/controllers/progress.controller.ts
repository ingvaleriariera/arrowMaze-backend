import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SyncProgressUseCase } from '../../application/use-cases/sync-progress.use-case';
import { ProgressMapper } from '../mappers/progress.mapper';
import { SyncRequestDTO } from '../dtos/sync.request.dto';
import { SyncResponseDTO } from '../dtos/sync.response.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { SyncProgressInput } from '../../application/dtos/sync-progress.input';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly syncProgressUseCase: SyncProgressUseCase,
    private readonly progressMapper: ProgressMapper,
  ) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync player progress with server' })
  @ApiResponse({
    status: 200,
    description: 'Progress synced successfully',
    type: SyncResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - token required',
  })
  async syncProgress(
    @Request() req: any,
    @Body() syncDto: SyncRequestDTO,
  ): Promise<SyncResponseDTO> {
    const userId = req.user.userId;
    const input = this.progressMapper.toSyncInput(userId, syncDto);
    const output = await this.syncProgressUseCase.execute(input);
    return this.progressMapper.toSyncResponse(output);
  }
}
