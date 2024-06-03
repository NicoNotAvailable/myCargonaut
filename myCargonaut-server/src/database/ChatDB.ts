import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserDB } from './UserDB';

@Entity()
export class ChatDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  writer: UserDB;

  @ManyToOne(() => UserDB)
  receiver: UserDB;

  @Column()
  message: string;

  @Column({ default: new Date().toISOString() })
  timestamp: string;
}
