import { GetLevelsUseCase } from '../get-levels.use-case';
import { GetLevelsInput } from '../../dtos/get-levels.input';
import { makeLevelDefinition } from './helpers/domain-factories';

describe('GetLevelsUseCase', () => {
  let useCase: GetLevelsUseCase;
  let mockLevelRepository: any;

  beforeEach(() => {
    // Arrange
    mockLevelRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByDifficulty: jest.fn(),
    };

    useCase = new GetLevelsUseCase(mockLevelRepository);
  });

  describe('should_return_all_levels_when_no_difficulty_filter', () => {
    it('should return all levels without filter', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = undefined;

      const level1 = makeLevelDefinition(0);
      const level2 = makeLevelDefinition(1);
      const level3 = makeLevelDefinition(2);

      mockLevelRepository.findAll.mockResolvedValue([level1, level2, level3]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.levels.length).toBe(3);
      expect(mockLevelRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockLevelRepository.findByDifficulty).not.toHaveBeenCalled();
    });
  });

  describe('should_return_filtered_levels_when_difficulty_provided', () => {
    it('should return only easy levels when difficulty is easy', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = 'easy';

      const level1 = makeLevelDefinition(0);
      const level2 = makeLevelDefinition(1);

      mockLevelRepository.findByDifficulty.mockResolvedValue([level1, level2]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.levels.length).toBe(2);
      expect(mockLevelRepository.findByDifficulty).toHaveBeenCalledTimes(1);
      expect(mockLevelRepository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('should_filter_by_medium_difficulty', () => {
    it('should return medium difficulty levels', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = 'medium';

      const level1 = makeLevelDefinition(0);
      mockLevelRepository.findByDifficulty.mockResolvedValue([level1]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(mockLevelRepository.findByDifficulty).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'medium' }),
      );
    });
  });

  describe('should_filter_by_hard_difficulty', () => {
    it('should return hard difficulty levels', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = 'hard';

      const level1 = makeLevelDefinition(0);
      mockLevelRepository.findByDifficulty.mockResolvedValue([level1]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(mockLevelRepository.findByDifficulty).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'hard' }),
      );
    });
  });

  describe('should_throw_error_when_difficulty_is_invalid', () => {
    it('should throw error for invalid difficulty', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = 'impossible';

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
      expect(mockLevelRepository.findByDifficulty).not.toHaveBeenCalled();
    });
  });

  describe('should_return_empty_list_when_no_levels_exist', () => {
    it('should return empty list', async () => {
      // Arrange
      const input = new GetLevelsInput();
      input.difficulty = undefined;

      mockLevelRepository.findAll.mockResolvedValue([]);

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.levels.length).toBe(0);
    });
  });
});
