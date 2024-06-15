import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OfferTripDB } from './OfferTripDB';
import { DriveDB } from './DriveDB';

@Entity()
export class LocationDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DriveDB, { onDelete: 'CASCADE' })
  drive: DriveDB;

  @Column()
  stopNr: number;

  @Column()
  country: string;

  @Column()
  zipCode: number;

  @Column()
  city: string;

  @OneToMany(() => OfferTripDB, (request) => request.startLocation, {
    cascade: true,
  })
  startLocationRequests: Promise<OfferTripDB[]>;

  @OneToMany(() => OfferTripDB, (request) => request.endLocation, {
    cascade: true,
  })
  endLocationRequests: Promise<OfferTripDB[]>;
}
