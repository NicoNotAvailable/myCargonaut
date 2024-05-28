import { Column, ChildEntity } from 'typeorm';
import { VehicleDB } from './VehicleDB';

@ChildEntity()
export class TrailerDB extends VehicleDB {
  @Column()
  isCooled: boolean;

  @Column()
  isEnclosed: boolean;
}
