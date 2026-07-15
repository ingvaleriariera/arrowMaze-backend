import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 30 })
  username!: string;

  @Column('text')
  passwordHash!: string;

  @Column('varchar', { length: 10 })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
