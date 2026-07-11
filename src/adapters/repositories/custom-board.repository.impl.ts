import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomBoard } from '../../domain/aggregates/custom-board.aggregate';
import { ICustomBoardRepository } from '../../domain/ports/custom-board.repository.port';
import { CustomBoardEntity } from '../../infrastructure/orm/custom-board.entity';
import { CustomBoardEntityMapper } from '../mappers/custom-board-entity.mapper';

@Injectable()
export class CustomBoardRepositoryImpl implements ICustomBoardRepository {
  constructor(
    @InjectRepository(CustomBoardEntity)
    private readonly repository: Repository<CustomBoardEntity>,
    private readonly entityMapper: CustomBoardEntityMapper,
  ) {}

  async save(board: CustomBoard): Promise<void> {
    const entity = this.entityMapper.toPersistence(board);
    await this.repository.save(entity);
  }

  async findAll(limit: number): Promise<CustomBoard[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return entities.map((e) => this.entityMapper.toDomain(e));
  }
}
