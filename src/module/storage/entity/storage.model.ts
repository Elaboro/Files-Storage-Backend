import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.model';

@Entity({ name: 'storage' })
export class Storage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'bytea', nullable: true })
  iv: Buffer;

  @Column({ type: 'text', nullable: true })
  filename: string;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
