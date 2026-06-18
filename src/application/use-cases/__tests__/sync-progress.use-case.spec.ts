import { SyncProgressUseCase } from '../sync-progress.use-case';
import { SyncProgressInput } from '../../dtos/sync-progress.input';
import { LevelProgressDTO } from '../../dtos/level-progress.dto';
import { makePlayerProgress } from './helpers/domain-factories';

describe('SyncProgressUseCase', () => {
  let useCase: SyncProgressUseCase;
  let mockProgressRepository: any;
  let mockConflictResolver: any;

  beforeEach(() => {
    // Arrange
    mockProgressRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByUserId: jest.fn(),
    };

    mockConflictResolver = {
      resolve: jest.fn(),
    };

    useCase = new SyncProgressUseCase(
      mockProgressRepository,
      mockConflictResolver,
    );
  });

  describe('should_create_new_progress_when_user_has_no_existing_progress', () => {
    it('should create and save new progress', async () => {
      // Arrange
      const input = new SyncProgressInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levels = [
        {
          levelId: '550e8400-e29b-41d4-a716-446655440001',
          bestScore: 150,
          completedAt: new Date().toISOString(),
        } as LevelProgressDTO,
      ];

      mockProgressRepository.findByUserId.mockResolvedValue(null);

      const newProgress = makePlayerProgress('550e8400-e29b-41d4-a716-446655440000');
      newProgress.recordCompletion(
        require('../../../domain/value-objects/level-id.vo').LevelId.create(
          '550e8400-e29b-41d4-a716-446655440001',
        ),
        require('../../../domain/value-objects/score.vo').Score.create(150),
      );

      mockConflictResolver.resolve.mockReturnValue(newProgress);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(mockProgressRepository.save).toHaveBeenCalledTimes(1);
      expect(mockConflictResolver.resolve).toHaveBeenCalledTimes(1);
      expect(output.levels.length).toBeGreaterThan(0);
    });
  });

  describe('should_resolve_conflict_when_existing_progress_found', () => {
    it('should merge progress with conflict resolution', async () => {
      // Arrange
      const input = new SyncProgressInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levels = [
        {
          levelId: 'level-002',
          bestScore: 200,
          completedAt: new Date().toISOString(),
        } as LevelProgressDTO,
      ];

      const existingProgress = makePlayerProgress('550e8400-e29b-41d4-a716-446655440000');
      mockProgressRepository.findByUserId.mockResolvedValue(existingProgress);

      const resolvedProgress = makePlayerProgress('550e8400-e29b-41d4-a716-446655440000');
      mockConflictResolver.resolve.mockReturnValue(resolvedProgress);

      // Act
      await useCase.execute(input);

      // Assert
      expect(mockConflictResolver.resolve).toHaveBeenCalledWith(
        expect.anything(),
        existingProgress,
      );
      expect(mockProgressRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_return_merged_levels_after_sync', () => {
    it('should return levels from resolved progress', async () => {
      // Arrange
      const input = new SyncProgressInput();
      input.userId = '550e8400-e29b-41d4-a716-446655440000';
      input.levels = [] as LevelProgressDTO[];

      mockProgressRepository.findByUserId.mockResolvedValue(null);

      const resolvedProgress = makePlayerProgress('550e8400-e29b-41d4-a716-446655440000');
      mockConflictResolver.resolve.mockReturnValue(resolvedProgress);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.levels).toBeDefined();
      expect(Array.isArray(output.levels)).toBe(true);
    });
  });

  describe('should_throw_error_when_userId_is_invalid', () => {
    it('should throw error for invalid user ID', async () => {
      // Arrange
      const input = new SyncProgressInput();
      input.userId = 'invalid-uuid';
      input.levels = [];

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });
});
