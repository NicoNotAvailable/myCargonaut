import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from 'typeorm';
import { UserDB } from './UserDB';
import { TripDB } from './TripDB';

@Entity()
@TableInheritance({ column: { type: 'string', name: 'type' } })
export class VehicleDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  owner: UserDB;

  @Column()
  carPicture: string;

  @Column()
  seats: number;

  @Column()
  weight: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @OneToMany(() => TripDB, (trip) => trip.car)
  rides: Promise<TripDB[]>;
}
