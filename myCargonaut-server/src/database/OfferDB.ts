import { Column, ManyToOne, OneToMany, ChildEntity } from 'typeorm';
import { PriceTypeEnum } from './enums/PriceTypeEnum';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';
import { DriveDB } from './DriveDB';
import { OfferTripDB } from './OfferTripDB';

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

  @OneToMany(() => OfferTripDB, (trip) => trip.drive)
  trips: Promise<OfferTripDB[]>;
}
