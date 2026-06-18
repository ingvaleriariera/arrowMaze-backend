import { SubmitScoreUseCase } from '../submit-score.use-case';
import { SubmitScoreInput } from '../../dtos/submit-score.input';
import { makePlayerProgress } from './helpers/domain-factories';
import { Score } from '../../../domain/value-objects/score.vo';

describe('SubmitScoreUseCase', () => {
  let useCase: SubmitScoreUseCase;
  let mockScoreRepository: any;
  let mockProgressRepository: any;
  let mockLeaderboardPolicy: any;

  beforeEach(() => {
    // Arrange
    mockScoreRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findTopByLevel: jest.fn(),
    };

    mockProgressRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByUserId: jest.fn(),
    };

    mockLeaderboardPolicy = {
      qualifiesForLeaderboard: jest.fn(),
    };

    useCase = new SubmitScoreUseCase(
      mockScoreRepository,
      mockProgressRepository,
      mockLeaderboardPolicy,
    );
  });

  describe('should_accept_score_and_qualify_when_score_is_new_best', () => {
    it('should accept and qualify new score', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levelId = '550e8400-e29b-41d4-a716-446655440001';
      input.score = 200;

      mockProgressRepository.findByUserId.mockResolvedValue(null);
      mockLeaderboardPolicy.qualifiesForLeaderboard.mockReturnValue(true);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.accepted).toBe(true);
      expect(output.qualifiedForLeaderboard).toBe(true);
      expect(mockScoreRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_accept_score_but_not_qualify_when_score_is_not_best', () => {
    it('should accept but not qualify inferior score', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levelId = '550e8400-e29b-41d4-a716-446655440001';
      input.score = 50;

      const progress = makePlayerProgress('550e8400-e29b-41d4-a716-446655440000');
      mockProgressRepository.findByUserId.mockResolvedValue(progress);
      mockLeaderboardPolicy.qualifiesForLeaderboard.mockReturnValue(false);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.accepted).toBe(true);
      expect(output.qualifiedForLeaderboard).toBe(false);
      expect(mockScoreRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_always_save_score_entry_regardless_of_qualification', () => {
    it('should save score whether or not it qualifies', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levelId = '550e8400-e29b-41d4-a716-446655440001';
      input.score = 100;

      mockProgressRepository.findByUserId.mockResolvedValue(null);
      mockLeaderboardPolicy.qualifiesForLeaderboard.mockReturnValue(true);

      // Act
      await useCase.execute(input);

      // Assert
      expect(mockScoreRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_throw_error_when_score_is_negative', () => {
    it('should throw error for negative score', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levelId = '550e8400-e29b-41d4-a716-446655440001';
      input.score = -10;

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });

  describe('should_throw_error_when_userId_is_invalid', () => {
    it('should throw error for invalid user ID', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = 'invalid-uuid';
      input.levelId = '550e8400-e29b-41d4-a716-446655440001';
      input.score = 100;

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });

  describe('should_throw_error_when_levelId_is_invalid', () => {
    it('should throw error for invalid level ID', async () => {
      // Arrange
      const input = new SubmitScoreInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levelId = '';
      input.score = 100;

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });
});
