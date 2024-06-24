import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { RequestTripDB } from './RequestTripDB';
import { OfferDB } from './DriveDB';

@ChildEntity()
export class CarDB extends VehicleDB {
  @Column({ default: 'pexels-mikebirdy-116675.jpg' })
  carPicture: string;

  @Column()
  seats: number;

  @Column()
  hasAC: boolean;

  @Column()
  hasTelevision: boolean;

  @OneToMany(() => OfferDB, (drive) => drive.car)
  rides: Promise<OfferDB[]>;

  @OneToMany(() => RequestTripDB, (drive) => drive.car)
  requestTrips: Promise<RequestTripDB[]>;
}
