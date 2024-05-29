import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { TripDB } from './TripDB';
import { ReviewDB } from './ReviewDB';

@Entity()
export class UserDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: Date;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ nullable: true })
  profileText: string;

  @OneToMany(() => VehicleDB, (car) => car.owner)
  cars: Promise<VehicleDB[]>;

  @OneToMany(() => TripDB, (trip) => trip.offering)
  offers: Promise<TripDB[]>;

  @OneToMany(() => TripDB, (trip) => trip.requesting)
  requests: Promise<TripDB[]>;

  @OneToMany(() => ReviewDB, (review) => review.writer)
  writtenReviews: Promise<ReviewDB[]>;
}
