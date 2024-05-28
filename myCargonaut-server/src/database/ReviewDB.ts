import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { TripDB } from './TripDB';
import { StarsEnum } from "./enums/StarsEnum";
import { UserDB } from "./UserDB";

@Entity()
export class ReviewDB {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TripDB)
    trip: TripDB;

    @ManyToOne(() => UserDB)
    writer: UserDB;

    @Column()
    punctuality: StarsEnum;

    @Column()
    reliability: StarsEnum;

    @Column()
    comfort: StarsEnum;

    @Column()
    damage: StarsEnum;

}
