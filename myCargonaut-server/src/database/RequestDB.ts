import { ChildEntity, OneToMany } from 'typeorm';
import { DriveDB } from './DriveDB';
import { CargoDB } from './CargoDB';
import { RequestTripDB } from './RequestTripDB';

@ChildEntity()
export class RequestDB extends DriveDB {
  @OneToMany(() => CargoDB, (cargo) => cargo.request)
  cargo: Promise<CargoDB[]>;

  @OneToMany(() => RequestTripDB, (trip) => trip.drive)
  trips: Promise<RequestTripDB[]>;
}
