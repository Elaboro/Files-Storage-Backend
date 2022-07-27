import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Storage } from '../entity/storage.model';

@Entity({ name: 'user' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Length(3, 20)
  username: string;

  @Column({ type: 'text', unique: true })
  password: string;

  @Column({ type: 'text', unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Storage, (storage) => storage.user)
  files: Storage[];
}
