import { Injectable } from '@nestjs/common';
import { LeaderboardResponseDTO } from '../dtos/leaderboard.response.dto';
import { LeaderboardEntryHttpDTO } from '../dtos/leaderboard-entry-http.dto';
import { GetLeaderboardInput } from '../../application/dtos/get-leaderboard.input';
import { GetLeaderboardOutput } from '../../application/dtos/get-leaderboard.output';

@Injectable()
export class LeaderboardMapper {
  toGetLeaderboardInput(levelId: string, limit: number): GetLeaderboardInput {
    const input = new GetLeaderboardInput();
    input.levelId = levelId;
    input.limit = limit;
    return input;
  }

  toLeaderboardResponse(output: GetLeaderboardOutput): LeaderboardResponseDTO {
    const response = new LeaderboardResponseDTO();
    response.entries = output.entries.map((entry) => {
      const httpDto = new LeaderboardEntryHttpDTO();
      httpDto.rank = entry.rank;
      httpDto.username = entry.username;
      httpDto.score = entry.score;
      httpDto.achievedAt = entry.achievedAt;
      return httpDto;
    });
    return response;
  }
}
