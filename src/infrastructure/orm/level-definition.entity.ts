import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('level_definitions')
export class LevelDefinitionEntity {
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  @Column('varchar', { length: 20 })
  difficulty!: string;

  @Column('integer')
  moveLimit!: number;

  @Column('text')
  boardLayout!: string;

  @Column('integer', { default: 1 })
  version!: number;
}
