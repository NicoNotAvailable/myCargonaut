import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CarDB } from './CarDB';
import { TripDB } from './TripDB';

@Entity()
export class UserDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: Date;

  @Column()
  phoneNumber: number;

  @Column()
  profilePic: string;

  @Column()
  profileText: string;

  @OneToMany(() => CarDB, (car) => car.owner)
  cars: Promise<CarDB[]>;

  @OneToMany(() => TripDB, (trip) => trip.offering)
  offers: Promise<TripDB[]>;
}
