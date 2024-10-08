import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserDB } from './UserDB';
import { TripDB } from './TripDB';

@Entity()
export class MessageDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  writer: UserDB;

  @ManyToOne(() => TripDB, { onDelete: 'CASCADE' })
  trip: TripDB;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: new Date().toISOString() })
  timestamp: string;
}
