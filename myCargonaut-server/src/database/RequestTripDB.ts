import { ChildEntity, ManyToOne } from 'typeorm';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';
import { TripDB } from './TripDB';
import { RequestDB } from './DriveDB';

@ChildEntity()
export class RequestTripDB extends TripDB {
  @ManyToOne(() => RequestDB, { onDelete: 'CASCADE' })
  drive: RequestDB;

  @ManyToOne(() => CarDB)
  car: CarDB;

  @ManyToOne(() => TrailerDB)
  trailer: TrailerDB;
}
