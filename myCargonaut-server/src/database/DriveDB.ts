import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { UserDB } from './UserDB';
import { TripInfoEnum } from './enums/TripInfoEnum';
import { LocationDB } from './LocationDB';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';
import { PriceTypeEnum } from './enums/PriceTypeEnum';
import { OfferTripDB } from './OfferTripDB';
import { CargoDB } from './CargoDB';
import { RequestTripDB } from './RequestTripDB';
import { StatusEnum } from './enums/StatusEnum';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DriveDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  user: UserDB;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  name: string;

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

  @Column({ default: 0 })
  status: StatusEnum;

  @OneToMany(() => LocationDB, (location) => location.drive, {
    onDelete: 'CASCADE',
  })
  location: Promise<LocationDB[]>;
}

@ChildEntity()
export class OfferDB extends DriveDB {
  @ManyToOne(() => CarDB)
  car: CarDB;

  @ManyToOne(() => TrailerDB)
  trailer: TrailerDB;

  @Column()
  priceType: PriceTypeEnum;

  @Column()
  maxCWeight: number;

  @Column()
  maxCLength: number;

  @Column()
  maxCHeight: number;

  @Column()
  maxCWidth: number;

  @Column()
  maxTWeight: number;

  @Column()
  maxTLength: number;

  @Column()
  maxTHeight: number;

  @Column()
  maxTWidth: number;

  @OneToMany(() => OfferTripDB, (trip) => trip.drive, { onDelete: 'CASCADE' })
  trips: Promise<OfferTripDB[]>;
}

@ChildEntity()
export class RequestDB extends DriveDB {
  @OneToMany(() => CargoDB, (cargo) => cargo.request, { onDelete: 'CASCADE' })
  cargo: Promise<CargoDB[]>;

  @OneToMany(() => RequestTripDB, (trip) => trip.drive, { onDelete: 'CASCADE' })
  trips: Promise<RequestTripDB[]>;
}
