import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { TripDB } from './TripDB';

@ChildEntity()
export class TrailerDB extends VehicleDB {
  @Column()
  isCooled: boolean;

  @Column()
  isEnclosed: boolean;

  @OneToMany(() => TripDB, (trip) => trip.trailer)
  rides: Promise<TripDB[]>;
}
