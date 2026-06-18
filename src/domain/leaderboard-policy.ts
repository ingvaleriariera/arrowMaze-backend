import { Score } from './value-objects/score.vo';

export const LEADERBOARD_POLICY = 'LEADERBOARD_POLICY';

export class LeaderboardPolicy {
  qualifiesForLeaderboard(newScore: Score, currentBest: Score): boolean {
    return newScore.isGreaterThan(currentBest);
  }
}
