import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { OfferDB } from './OfferDB';
import { RequestTripDB } from './RequestTripDB';

@ChildEntity()
export class TrailerDB extends VehicleDB {
  @Column()
  isCooled: boolean;

  @Column()
  isEnclosed: boolean;

  @OneToMany(() => OfferDB, (drive) => drive.trailer)
  rides: Promise<OfferDB[]>;

  @OneToMany(() => RequestTripDB, (drive) => drive.trailer)
  requestTrips: Promise<RequestTripDB[]>;
}
