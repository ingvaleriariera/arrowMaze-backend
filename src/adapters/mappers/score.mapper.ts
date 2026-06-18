import { Injectable } from '@nestjs/common';
import { SubmitScoreRequestDTO } from '../dtos/submit-score.request.dto';
import { SubmitScoreResponseDTO } from '../dtos/submit-score.response.dto';
import { SubmitScoreInput } from '../../application/dtos/submit-score.input';
import { SubmitScoreOutput } from '../../application/dtos/submit-score.output';

@Injectable()
export class ScoreMapper {
  toSubmitInput(userId: string, dto: SubmitScoreRequestDTO): SubmitScoreInput {
    const input = new SubmitScoreInput();
    input.userId = userId;
    input.levelId = dto.levelId;
    input.score = dto.score;
    return input;
  }

  toSubmitResponse(output: SubmitScoreOutput): SubmitScoreResponseDTO {
    const response = new SubmitScoreResponseDTO();
    response.accepted = output.accepted;
    response.qualifiedForLeaderboard = output.qualifiedForLeaderboard;
    return response;
  }
}
