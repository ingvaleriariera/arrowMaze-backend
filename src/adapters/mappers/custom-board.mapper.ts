import { Injectable } from '@nestjs/common';
import { CreateCustomBoardInput } from '../../application/dtos/create-custom-board.input';
import { CreateCustomBoardOutput } from '../../application/dtos/create-custom-board.output';
import { GetCustomBoardsOutput } from '../../application/dtos/get-custom-boards.output';
import { CreateCustomBoardRequestDto } from '../dtos/create-custom-board.request.dto';
import { CreateCustomBoardResponseDto } from '../dtos/create-custom-board.response.dto';
import { CustomBoardHttpDTO } from '../dtos/custom-board-http.dto';
import { CustomBoardsResponseDto } from '../dtos/custom-boards.response.dto';

@Injectable()
export class CustomBoardMapper {
  toCreateInput(
    authorId: string,
    dto: CreateCustomBoardRequestDto,
  ): CreateCustomBoardInput {
    const input = new CreateCustomBoardInput();
    input.authorId = authorId;
    input.name = dto.name;
    input.difficulty = dto.difficulty;
    input.boardLayout = dto.boardLayout;
    return input;
  }

  toCreateResponse(output: CreateCustomBoardOutput): CreateCustomBoardResponseDto {
    const response = new CreateCustomBoardResponseDto();
    response.id = output.id;
    response.name = output.name;
    response.authorId = output.authorId;
    response.authorUsername = output.authorUsername;
    response.difficulty = output.difficulty;
    response.boardLayout = output.boardLayout;
    response.createdAt = output.createdAt;
    return response;
  }

  toBoardsResponse(output: GetCustomBoardsOutput): CustomBoardsResponseDto {
    const response = new CustomBoardsResponseDto();
    response.boards = output.boards.map((board) => {
      const dto = new CustomBoardHttpDTO();
      dto.id = board.id;
      dto.name = board.name;
      dto.authorId = board.authorId;
      dto.authorUsername = board.authorUsername;
      dto.difficulty = board.difficulty;
      dto.boardLayout = board.boardLayout;
      dto.createdAt = board.createdAt;
      return dto;
    });
    return response;
  }
}
