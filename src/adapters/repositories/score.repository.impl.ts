import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IScoreRepository } from '../../domain/ports/score.repository.port';
import { ScoreEntry } from '../../domain/aggregates/score-entry.aggregate';
import { ScoreEntryEntity } from '../../infrastructure/entities/score-entry.entity';
import { ScoreEntryEntityMapper } from '../mappers/score-entry-entity.mapper';
import { LevelId } from '../../domain/value-objects/level-id.vo';

@Injectable()
export class ScoreRepositoryImpl implements IScoreRepository {
  constructor(
    @InjectRepository(ScoreEntryEntity)
    private readonly repository: Repository<ScoreEntryEntity>,
    private readonly entityMapper: ScoreEntryEntityMapper,
  ) {}

  async save(entry: ScoreEntry): Promise<void> {
    const entity = this.entityMapper.toPersistence(entry);
    await this.repository.save(entity);
  }

  async findTopByLevel(levelId: LevelId, limit: number): Promise<ScoreEntry[]> {
    const entities = await this.repository.find({
      where: { levelId: levelId.toString() },
      order: { score: 'DESC' },
      take: limit,
    });
    return entities.map((entity) => this.entityMapper.toDomain(entity));
  }
}
