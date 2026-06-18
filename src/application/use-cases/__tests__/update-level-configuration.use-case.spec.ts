import { UpdateLevelConfigurationUseCase } from '../update-level-configuration.use-case';
import { UpdateLevelInput } from '../../dtos/update-level.input';
import { makeLevelDefinition } from './helpers/domain-factories';

describe('UpdateLevelConfigurationUseCase', () => {
  let useCase: UpdateLevelConfigurationUseCase;
  let mockLevelRepository: any;

  beforeEach(() => {
    // Arrange
    mockLevelRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByDifficulty: jest.fn(),
    };

    useCase = new UpdateLevelConfigurationUseCase(mockLevelRepository);
  });

  describe('should_update_layout_and_increment_version_when_level_exists', () => {
    it('should update layout and increment version', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';
      input.boardLayout = JSON.stringify({
        grid: [[1, 0], [0, 1]],
        rows: 2,
        cols: 2,
      });

      const level = makeLevelDefinition(0);
      const initialVersion = level.getVersion();

      mockLevelRepository.findById.mockResolvedValue(level);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.version).toBe(initialVersion + 1);
      expect(mockLevelRepository.save).toHaveBeenCalledTimes(1);
      expect(mockLevelRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          version: initialVersion + 1,
        }),
      );
    });
  });

  describe('should_throw_error_when_level_not_found', () => {
    it('should throw error for non-existent level', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-nonexistent';
      input.boardLayout = JSON.stringify({ grid: [] });

      mockLevelRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow('Level not found');
      expect(mockLevelRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('should_update_move_limit_when_provided', () => {
    it('should update move limit and increment version', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';
      input.moveLimit = 20;

      const level = makeLevelDefinition(0);
      const initialVersion = level.getVersion();

      mockLevelRepository.findById.mockResolvedValue(level);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.version).toBe(initialVersion + 1);
      expect(mockLevelRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_update_both_layout_and_move_limit_when_both_provided', () => {
    it('should update both fields and increment version once', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';
      input.boardLayout = JSON.stringify({
        grid: [[0, 1], [1, 0]],
        rows: 2,
        cols: 2,
      });
      input.moveLimit = 15;

      const level = makeLevelDefinition(0);
      const initialVersion = level.getVersion();

      mockLevelRepository.findById.mockResolvedValue(level);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.version).toBe(initialVersion + 2); // Incremented twice
      expect(mockLevelRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_throw_error_when_levelId_is_invalid', () => {
    it('should throw error for invalid level ID', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = '';
      input.boardLayout = JSON.stringify({ grid: [] });

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
      expect(mockLevelRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('should_throw_error_when_boardLayout_format_is_invalid', () => {
    it('should throw error for invalid JSON layout', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';
      input.boardLayout = 'not-valid-json';

      const level = makeLevelDefinition(0);
      mockLevelRepository.findById.mockResolvedValue(level);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });

  describe('should_throw_error_when_moveLimit_is_invalid', () => {
    it('should throw error for invalid move limit', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';
      input.moveLimit = 0; // Invalid: must be > 0

      const level = makeLevelDefinition(0);
      mockLevelRepository.findById.mockResolvedValue(level);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });

  describe('should_not_update_anything_when_neither_layout_nor_limit_provided', () => {
    it('should not modify level when no update fields provided', async () => {
      // Arrange
      const input = new UpdateLevelInput();
      input.levelId = 'level-001';

      const level = makeLevelDefinition(0);
      const initialVersion = level.getVersion();

      mockLevelRepository.findById.mockResolvedValue(level);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.version).toBe(initialVersion); // No increment
      expect(mockLevelRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
