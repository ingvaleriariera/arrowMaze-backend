import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserEntity } from '../../infrastructure/orm/user.entity';
import { UserEntityMapper } from '../mappers/user-entity.mapper';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly entityMapper: UserEntityMapper,
  ) {}

  async save(user: User): Promise<void> {
    const entity = this.entityMapper.toPersistence(user);
    await this.repository.save(entity);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toString() },
    });
    return entity ? this.entityMapper.toDomain(entity) : null;
  }

  async findById(id: UserId): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id: id.toString() },
    });
    return entity ? this.entityMapper.toDomain(entity) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.toString() },
    });
    return count > 0;
  }
}
