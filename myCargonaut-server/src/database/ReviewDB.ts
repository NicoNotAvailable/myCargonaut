import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Check,
} from 'typeorm';
import { TripDB } from './TripDB';
import { UserDB } from './UserDB';

@Entity()
@Check(`"rating" BETWEEN 1 AND 5`)

export class ReviewDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TripDB, { onDelete: 'CASCADE' })
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
  
    @ManyToOne(() => UserDB)
    about: UserDB;

    @Column()
    rating: number;

    @Column()
    text: string;
}
