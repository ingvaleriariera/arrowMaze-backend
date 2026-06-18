import { Entity, PrimaryColumn, Column, UpdateDateColumn, Index } from 'typeorm';
import { LevelProgressEmbedded } from './level-progress.embedded';

@Entity('player_progress')
@Index(['userId'])
export class PlayerProgressEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('simple-json')
  levels: LevelProgressEmbedded[];

  @UpdateDateColumn()
  updatedAt: Date;
}
