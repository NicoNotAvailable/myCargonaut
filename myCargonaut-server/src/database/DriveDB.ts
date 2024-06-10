import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from 'typeorm';
import { UserDB } from './UserDB';
import { TripInfoEnum } from './enums/TripInfoEnum';
import { LocationDB } from './LocationDB';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DriveDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  user: UserDB;

  @Column()
  price: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  seats: number;

  @Column()
  animalsAllowed: boolean;

  @Column()
  smokingAllowed: boolean;

  @Column()
  info: TripInfoEnum;

  @Column({ default: new Date().toISOString() })
  timestamp: string;

  @OneToMany(() => LocationDB, (location) => location.drive)
  location: Promise<LocationDB>;
}
