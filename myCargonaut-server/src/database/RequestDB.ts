import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { UserDB } from './UserDB';
import { TripDB } from './TripDB';
import { LocationDB } from './LocationDB';

@Entity()
export class RequestDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  requesting: UserDB;

  @ManyToOne(() => TripDB)
  trip: TripDB;

  @Column({ default: new Date().toISOString() })
  timestamp: string;

  @OneToOne(() => LocationDB, (location: { request: any }) => location.request)
  location: Promise<LocationDB>;
}
