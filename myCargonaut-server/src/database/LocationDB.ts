import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TripDB } from './TripDB';

@Entity()
export class LocationDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TripDB)
  trip: TripDB;

  @Column()
  stopNr: number;

  @Column()
  country: string;

  @Column()
  zipCode: number;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  streetNumber: string;
}
