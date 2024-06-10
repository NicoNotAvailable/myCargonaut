import { Entity, ManyToOne, Column, OneToMany } from 'typeorm';
import { LocationDB } from './LocationDB';
import { CargoDB } from './CargoDB';
import { TripDB } from './TripDB';
import { OfferDB } from './OfferDB';

@Entity()
export class OfferTripDB extends TripDB {
  @ManyToOne(() => OfferDB)
  drive: OfferDB;

  @ManyToOne(() => LocationDB)
  startLocation: LocationDB;

  @ManyToOne(() => LocationDB)
  endLocation: LocationDB;

  @Column()
  usedSeats: number;

  @OneToMany(() => CargoDB, (cargo) => cargo.offerTrip)
  cargo: Promise<CargoDB[]>;
}
