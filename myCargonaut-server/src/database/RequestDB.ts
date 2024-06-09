import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserDB } from './UserDB';
import { LocationDB } from './LocationDB';
import { TripDB } from './TripDB';

@Entity()
export class RequestDB {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDB)
    requesting: UserDB;

    @ManyToOne(() => TripDB)
    trip: TripDB;

    @ManyToOne(() => LocationDB)
    startLocation: LocationDB;

    @ManyToOne(() => LocationDB)
    endLocation: LocationDB;

    @Column({ default: new Date().toISOString() })
    timestamp: string;
}
