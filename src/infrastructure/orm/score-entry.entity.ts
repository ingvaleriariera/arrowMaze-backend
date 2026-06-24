import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('score_entries')
@Index(['levelId'])
@Index(['userId'])
@Index(['levelId', 'score'])
export class ScoreEntryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('varchar', { length: 50 })
  levelId!: string;

  @Column('integer')
  score!: number;

  @Column('timestamp')
  achievedAt!: Date;
}
