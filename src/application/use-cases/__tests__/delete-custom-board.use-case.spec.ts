import { DeleteCustomBoardUseCase } from '../delete-custom-board.use-case';
import { UserId } from '../../../domain/value-objects/user-id.vo';

describe('DeleteCustomBoardUseCase', () => {
  const authorId = '491290cb-ff45-4daf-abbf-b8bb76da97ab';
  const otherId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const boardId = 'f2c91915-1747-44f7-83eb-7257d03c89a5';

  let useCase: DeleteCustomBoardUseCase;
  let mockRepository: any;

  const boardOwnedBy = (ownerId: string) => ({
    getAuthorId: () => UserId.create(ownerId),
  });

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteCustomBoardUseCase(mockRepository);
  });

  it('deletes the board when the requester is the author', async () => {
    mockRepository.findById.mockResolvedValue(boardOwnedBy(authorId));

    await useCase.execute(authorId, boardId);

    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('rejects deletion by anyone who is not the author', async () => {
    mockRepository.findById.mockResolvedValue(boardOwnedBy(authorId));

    await expect(useCase.execute(otherId, boardId)).rejects.toThrow(
      'Only the author can delete this board',
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('reports a missing board', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(authorId, boardId)).rejects.toThrow(
      'Board not found',
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
