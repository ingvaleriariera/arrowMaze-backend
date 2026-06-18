import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILevelDefinitionRepository } from '../../domain/ports/level-definition.repository.port';
import { LevelDefinition } from '../../domain/aggregates/level-definition.aggregate';
import { LevelDefinitionEntity } from '../../infrastructure/entities/level-definition.entity';
import { LevelDefinitionEntityMapper } from '../mappers/level-definition-entity.mapper';
import { LevelId } from '../../domain/value-objects/level-id.vo';
import { Difficulty } from '../../domain/value-objects/difficulty.vo';

@Injectable()
export class LevelDefinitionRepositoryImpl implements ILevelDefinitionRepository {
  constructor(
    @InjectRepository(LevelDefinitionEntity)
    private readonly repository: Repository<LevelDefinitionEntity>,
    private readonly entityMapper: LevelDefinitionEntityMapper,
  ) {}

  async save(level: LevelDefinition): Promise<void> {
    const entity = this.entityMapper.toPersistence(level);
    await this.repository.save(entity);
  }

  async findById(id: LevelId): Promise<LevelDefinition | null> {
    const entity = await this.repository.findOne({
      where: { id: id.toString() },
    });
    return entity ? this.entityMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<LevelDefinition[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.entityMapper.toDomain(entity));
  }

  async findByDifficulty(difficulty: Difficulty): Promise<LevelDefinition[]> {
    const entities = await this.repository.find({
      where: { difficulty: difficulty.getValue() },
    });
    return entities.map((entity) => this.entityMapper.toDomain(entity));
  }
}
