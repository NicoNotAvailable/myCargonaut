import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, Check} from 'typeorm';
import { TripDB } from './TripDB';
import { UserDB } from './UserDB';

@Entity()
@Check(`"punctuality" BETWEEN 1 AND 5`)
@Check(`"reliability" BETWEEN 1 AND 5`)
@Check(`"comfort" BETWEEN 1 AND 5`)
@Check(`"damage" BETWEEN 1 AND 5`)
export class ReviewDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TripDB)
  trip: TripDB;

  @ManyToOne(() => UserDB)
  writer: UserDB;

  @Column()
  punctuality: number;

  @Column()
  reliability: number;

  @Column()
  comfort: number;

  @Column()
  damage: number;
}
