import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from 'typeorm';
import { UserDB } from './UserDB';
import { StatusEnum } from './enums/StatusEnum';
import { ReviewDB } from './ReviewDB';
import { MessageDB } from './MessageDB';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class TripDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  requesting: UserDB;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ default: 0 })
  status: StatusEnum;

  @OneToMany(() => ReviewDB, (review) => review.trip)
  reviews: Promise<ReviewDB[]>;

  @OneToMany(() => MessageDB, (message) => message.trip)
  messages: Promise<MessageDB[]>;
}
