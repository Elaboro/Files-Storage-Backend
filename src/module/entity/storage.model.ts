import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../entity/users.model';

@Entity({ name: 'Storage' })
export class Storage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'bytea', nullable: true })
  iv: Buffer;

  @Column({ type: 'text', nullable: true })
  file_name: string;

  @ManyToOne(() => Users, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
