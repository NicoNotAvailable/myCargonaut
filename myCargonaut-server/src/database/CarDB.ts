import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { TypeEnum } from './enums/TypeEnum';
import { UserDB } from './UserDB';
import {TripDB} from "./TripDB";

@Entity()
export class CarDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  owner: UserDB;

  @Column()
  type: TypeEnum;

  @Column()
  carPicture: string;

  @Column()
  seats: number;

  @Column()
  weight: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @OneToMany(() => TripDB, (trip) => trip.car)
  rides: Promise<TripDB[]>;
}
