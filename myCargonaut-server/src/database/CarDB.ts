import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { TripDB } from './TripDB';

@ChildEntity()
export class CarDB extends VehicleDB {
  @Column()
  seats: number;

  @Column()
  hasAC: boolean;

  @Column()
  hasTelevision: boolean;

  @OneToMany(() => TripDB, (trip) => trip.car)
  rides: Promise<TripDB[]>;
}
