import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPlayerProgressRepository } from '../../domain/ports/player-progress.repository.port';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { PlayerProgressEntity } from '../../infrastructure/orm/player-progress.entity';
import { PlayerProgressEntityMapper } from '../mappers/player-progress-entity.mapper';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class PlayerProgressRepositoryImpl implements IPlayerProgressRepository {
  constructor(
    @InjectRepository(PlayerProgressEntity)
    private readonly repository: Repository<PlayerProgressEntity>,
    private readonly entityMapper: PlayerProgressEntityMapper,
  ) {}

  async save(progress: PlayerProgress): Promise<void> {
    const entity = this.entityMapper.toPersistence(progress);
    await this.repository.save(entity);
  }

  async findByUserId(userId: UserId): Promise<PlayerProgress | null> {
    const entity = await this.repository.findOne({
      where: { userId: userId.toString() },
    });
    return entity ? this.entityMapper.toDomain(entity) : null;
  }
}
