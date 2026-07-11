import { CreateCustomBoardUseCase } from '../create-custom-board.use-case';
import { CreateCustomBoardInput } from '../../dtos/create-custom-board.input';

describe('CreateCustomBoardUseCase', () => {
  let useCase: CreateCustomBoardUseCase;
  let mockRepository: any;

  const validGrid = JSON.stringify({
    grid: [
      [1, 1, 1, 1],
      [1, 1, 0, 1],
      [1, 0, 1, 1],
      [1, 1, 1, 1],
    ],
    rows: 4,
    cols: 4,
  });

  const makeInput = (overrides: Partial<CreateCustomBoardInput> = {}) => {
    const input = new CreateCustomBoardInput();
    input.authorId = '491290cb-ff45-4daf-abbf-b8bb76da97ab';
    input.name = 'Mi laberinto';
    input.difficulty = 'medium';
    input.boardLayout = validGrid;
    return Object.assign(input, overrides);
  };

  beforeEach(() => {
    mockRepository = { save: jest.fn(), findAll: jest.fn() };
    useCase = new CreateCustomBoardUseCase(mockRepository);
  });

  describe('should_persist_board_when_input_is_valid', () => {
    it('saves and returns the created board', async () => {
      const output = await useCase.execute(makeInput());

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      // uuid is mocked in the jest setup, so only assert an id was assigned.
      expect(output.id).not.toHaveLength(0);
      expect(output.name).toBe('Mi laberinto');
      expect(output.difficulty).toBe('medium');
      expect(output.boardLayout).toBe(validGrid);
    });
  });

  describe('should_reject_invalid_grids', () => {
    it('rejects a grid with too few active cells', async () => {
      const layout = JSON.stringify({
        grid: [
          [1, 1, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      });
      await expect(
        useCase.execute(makeInput({ boardLayout: layout })),
      ).rejects.toThrow('at least 10 active cells');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('rejects a non-rectangular grid', async () => {
      const layout = JSON.stringify({
        grid: [
          [1, 1, 1, 1],
          [1, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 1],
        ],
      });
      await expect(
        useCase.execute(makeInput({ boardLayout: layout })),
      ).rejects.toThrow('rectangular');
    });

    it('rejects cell values other than 0 and 1', async () => {
      const layout = JSON.stringify({
        grid: [
          [1, 1, 1, 1],
          [1, 2, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 1],
        ],
      });
      await expect(
        useCase.execute(makeInput({ boardLayout: layout })),
      ).rejects.toThrow('0 or 1');
    });

    it('rejects oversized grids', async () => {
      const layout = JSON.stringify({
        grid: Array.from({ length: 25 }, () => Array(25).fill(1)),
      });
      await expect(
        useCase.execute(makeInput({ boardLayout: layout })),
      ).rejects.toThrow('between 3 and 20 rows');
    });
  });

  describe('should_reject_invalid_names', () => {
    it('rejects names shorter than 3 characters', async () => {
      await expect(useCase.execute(makeInput({ name: 'ab' }))).rejects.toThrow(
        'between 3 and 30 characters',
      );
    });
  });
});
