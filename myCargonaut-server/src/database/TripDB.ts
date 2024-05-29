import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PriceTypeEnum } from './enums/PriceTypeEnum';
import { UserDB } from './UserDB';
import { TripInfoEnum } from './enums/TripInfoEnum';
import { StatusEnum } from './enums/StatusEnum';
import { ReviewDB } from './ReviewDB';
import { LocationDB } from './LocationDB';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';

@Entity()
export class TripDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  offering: UserDB;

  @ManyToOne(() => UserDB)
  requesting: UserDB;

  @ManyToOne(() => CarDB)
  car: CarDB;

  @ManyToOne(() => TrailerDB)
  trailer: TrailerDB;

  @Column()
  priceType: PriceTypeEnum;

  @Column()
  price: number;

  @Column()
  date: Date;

  @Column()
  maxWeight: number;

  @Column()
  maxLength: number;

  @Column()
  maxHeight: number;

  @Column()
  maxWidth: number;

  @Column()
  availableSeats: number;

  @Column()
  usedSeats: number;

  @Column()
  animals: boolean;

  @Column()
  smoker: boolean;

  @Column()
  info: TripInfoEnum;

  @Column()
  status: StatusEnum;

  @OneToMany(() => ReviewDB, (review) => review.trip)
  reviews: Promise<ReviewDB[]>;

  @OneToMany(() => LocationDB, (location) => location.trip)
  locations: Promise<LocationDB[]>;
}
