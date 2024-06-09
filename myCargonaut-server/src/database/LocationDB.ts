import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { TripDB } from './TripDB';
import { RequestDB } from './RequestDB';

@Entity()
export class LocationDB {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => TripDB)
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

    @OneToMany(() => RequestDB, (request) => request.startLocation)
    startLocationRequests: Promise<RequestDB[]>;

    @OneToMany(() => RequestDB, (request) => request.endLocation)
    endLocationRequests: Promise<RequestDB[]>;
}
