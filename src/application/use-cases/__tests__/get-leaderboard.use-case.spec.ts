import { GetLeaderboardUseCase } from '../get-leaderboard.use-case';
import { GetLeaderboardInput } from '../../dtos/get-leaderboard.input';
import { makeScoreEntry, makeUser } from './helpers/domain-factories';

describe('GetLeaderboardUseCase', () => {
  let useCase: GetLeaderboardUseCase;
  let mockScoreRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    // Arrange
    mockScoreRepository = {
      save: jest.fn(),
      findTopByLevel: jest.fn(),
    };

    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      existsByEmail: jest.fn(),
    };

    useCase = new GetLeaderboardUseCase(mockScoreRepository, mockUserRepository);
  });

  describe('should_return_ranked_entries_when_scores_exist', () => {
    it('should return leaderboard with rankings', async () => {
      // Arrange
      const input = new GetLeaderboardInput();
      input.levelId = 'level-001';
      input.limit = 10;

      const scoreEntry1 = makeScoreEntry('550e8400-e29b-41d4-a716-446655440010', 0, 300);
      const scoreEntry2 = makeScoreEntry('550e8400-e29b-41d4-a716-446655440011', 0, 200);
      const scoreEntry3 = makeScoreEntry('550e8400-e29b-41d4-a716-446655440012', 0, 100);

      mockScoreRepository.findTopByLevel.mockResolvedValue([
        scoreEntry1,
        scoreEntry2,
        scoreEntry3,
      ]);

      const user1 = makeUser('user1@example.com', 'user1');
      const user2 = makeUser('user2@example.com', 'user2');
      const user3 = makeUser('user3@example.com', 'user3');

      mockUserRepository.findById
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2)
        .mockResolvedValueOnce(user3);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.entries.length).toBe(3);
      expect(output.entries[0].rank).toBe(1);
      expect(output.entries[1].rank).toBe(2);
      expect(output.entries[2].rank).toBe(3);
      expect(output.entries[0].score).toBeGreaterThan(output.entries[1].score);
    });
  });

  describe('should_return_empty_list_when_no_scores_exist', () => {
    it('should return empty leaderboard', async () => {
      // Arrange
      const input = new GetLeaderboardInput();
      input.levelId = 'level-001';
      input.limit = 10;

      mockScoreRepository.findTopByLevel.mockResolvedValue([]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.entries.length).toBe(0);
    });
  });

  describe('should_use_unknown_when_user_not_found', () => {
    it('should use Unknown username when user not found', async () => {
      // Arrange
      const input = new GetLeaderboardInput();
      input.levelId = 'level-001';
      input.limit = 10;

      const scoreEntry = makeScoreEntry('550e8400-e29b-41d4-a716-446655440099', 0, 100);
      mockScoreRepository.findTopByLevel.mockResolvedValue([scoreEntry]);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.entries[0].username).toBe('Unknown');
    });
  });

  describe('should_respect_limit_parameter', () => {
    it('should limit results to specified count', async () => {
      // Arrange
      const input = new GetLeaderboardInput();
      input.levelId = 'level-001';
      input.limit = 2;

      const entries = [
        makeScoreEntry('550e8400-e29b-41d4-a716-446655440010', 0, 300),
        makeScoreEntry('550e8400-e29b-41d4-a716-446655440011', 0, 200),
      ];

      mockScoreRepository.findTopByLevel.mockResolvedValue(entries);

      const user1 = makeUser('user1@example.com', 'user1');
      const user2 = makeUser('user2@example.com', 'user2');

      mockUserRepository.findById
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(mockScoreRepository.findTopByLevel).toHaveBeenCalledWith(
        expect.anything(),
        2,
      );
    });
  });

  describe('should_throw_error_when_levelId_is_invalid', () => {
    it('should throw error for invalid level ID', async () => {
      // Arrange
      const input = new GetLeaderboardInput();
      input.levelId = '';
      input.limit = 10;

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });
});
