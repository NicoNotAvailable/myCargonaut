import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PriceTypeEnum } from './enums/PriceTypeEnum';
import { UserDB } from './UserDB';
import { CarDB } from './CarDB';
import { TripInfoEnum } from './enums/TripInfoEnum';
import { StatusEnum } from './enums/StatusEnum';

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

  @ManyToOne(() => CarDB)
  trailer: CarDB;

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
}
