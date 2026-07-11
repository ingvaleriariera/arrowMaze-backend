import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('custom_boards')
@Index(['authorId'])
export class CustomBoardEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  authorId!: string;

  @Column('varchar', { length: 30 })
  name!: string;

  @Column('varchar', { length: 20 })
  difficulty!: string;

  @Column('text')
  boardLayout!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
