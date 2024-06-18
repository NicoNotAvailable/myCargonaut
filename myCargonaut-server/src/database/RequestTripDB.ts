import { Entity, ManyToOne } from 'typeorm';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';
import { TripDB } from './TripDB';
import { RequestDB } from './DriveDB';

@Entity()
export class RequestTripDB extends TripDB {
  @ManyToOne(() => RequestDB)
  drive: RequestDB;

  @ManyToOne(() => CarDB)
  car: CarDB;

  @ManyToOne(() => TrailerDB)
  trailer: TrailerDB;
}
