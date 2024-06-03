import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { TripDB } from './TripDB';
import { RequestDB } from './RequestDB';

@Entity()
export class LocationDB {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TripDB, { nullable: true })
  trip: TripDB | null;

  @OneToOne(() => RequestDB, { nullable: true })
  request: RequestDB | null;

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
