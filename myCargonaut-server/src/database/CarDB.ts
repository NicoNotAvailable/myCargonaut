import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { OfferDB } from './OfferDB';
import { RequestTripDB } from './RequestTripDB';

@ChildEntity()
export class CarDB extends VehicleDB {
  @Column({ default: 'empty.png' })
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
