import { GetGlobalLeaderboardUseCase } from '../get-global-leaderboard.use-case';
import { GetGlobalLeaderboardInput } from '../../dtos/get-global-leaderboard.input';
import { makePlayerProgress, makeUser } from './helpers/domain-factories';
import { LevelId } from '../../../domain/value-objects/level-id.vo';
import { Score } from '../../../domain/value-objects/score.vo';

describe('GetGlobalLeaderboardUseCase', () => {
  let useCase: GetGlobalLeaderboardUseCase;
  let mockProgressRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockProgressRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
    };

    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      existsByEmail: jest.fn(),
    };

    useCase = new GetGlobalLeaderboardUseCase(
      mockProgressRepository,
      mockUserRepository,
    );
  });

  describe('should_sum_best_score_across_levels_per_player', () => {
    it('should rank players by the sum of their best score in every level, not raw history', async () => {
      const player1 = makePlayerProgress('550e8400-e29b-41d4-a716-446655440010');
      player1.recordCompletion(
        LevelId.create('550e8400-e29b-41d4-a716-446655440001'),
        Score.create(300),
      );
      player1.recordCompletion(
        LevelId.create('550e8400-e29b-41d4-a716-446655440002'),
        Score.create(100),
      );
      // Replaying with a lower score must not add on top of the best.
      player1.recordCompletion(
        LevelId.create('550e8400-e29b-41d4-a716-446655440002'),
        Score.create(50),
      );

      const player2 = makePlayerProgress('550e8400-e29b-41d4-a716-446655440011');
      player2.recordCompletion(
        LevelId.create('550e8400-e29b-41d4-a716-446655440001'),
        Score.create(200),
      );

      mockProgressRepository.findAll.mockResolvedValue([player1, player2]);

      const user1 = makeUser('p1@example.com', 'player1');
      const user2 = makeUser('p2@example.com', 'player2');
      mockUserRepository.findById
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      const input = new GetGlobalLeaderboardInput();
      input.limit = 10;

      const output = await useCase.execute(input);

      expect(output.entries.length).toBe(2);
      expect(output.entries[0].rank).toBe(1);
      expect(output.entries[0].username).toBe('player1');
      expect(output.entries[0].totalScore).toBe(400); // 300 + 100, not 300+100+50
      expect(output.entries[1].rank).toBe(2);
      expect(output.entries[1].totalScore).toBe(200);
    });
  });

  describe('should_exclude_players_with_no_completed_levels', () => {
    it('should filter out players with zero total score', async () => {
      const emptyPlayer = makePlayerProgress('550e8400-e29b-41d4-a716-446655440020');
      mockProgressRepository.findAll.mockResolvedValue([emptyPlayer]);

      const input = new GetGlobalLeaderboardInput();
      input.limit = 10;

      const output = await useCase.execute(input);

      expect(output.entries.length).toBe(0);
    });
  });

  describe('should_use_unknown_when_user_not_found', () => {
    it('should default to Unknown username', async () => {
      const player = makePlayerProgress('550e8400-e29b-41d4-a716-446655440030');
      player.recordCompletion(
        LevelId.create('550e8400-e29b-41d4-a716-446655440001'),
        Score.create(100),
      );
      mockProgressRepository.findAll.mockResolvedValue([player]);
      mockUserRepository.findById.mockResolvedValue(null);

      const input = new GetGlobalLeaderboardInput();
      input.limit = 10;

      const output = await useCase.execute(input);

      expect(output.entries[0].username).toBe('Unknown');
    });
  });

  describe('should_respect_limit_parameter', () => {
    it('should cap results to the requested limit', async () => {
      const players = [10, 11, 12].map((n, i) => {
        const p = makePlayerProgress(`550e8400-e29b-41d4-a716-4466554400${n}`);
        p.recordCompletion(
          LevelId.create('550e8400-e29b-41d4-a716-446655440001'),
          Score.create(100 - i),
        );
        return p;
      });
      mockProgressRepository.findAll.mockResolvedValue(players);
      mockUserRepository.findById.mockResolvedValue(makeUser());

      const input = new GetGlobalLeaderboardInput();
      input.limit = 2;

      const output = await useCase.execute(input);

      expect(output.entries.length).toBe(2);
    });
  });
});
