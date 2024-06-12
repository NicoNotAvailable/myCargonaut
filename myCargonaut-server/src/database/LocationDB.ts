import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { OfferTripDB } from './OfferTripDB';
import { DriveDB } from './DriveDB';

@Entity()
export class LocationDB {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DriveDB)
    drive: DriveDB;

    @Column()
    stopNr: number;

    @Column()
    country: string;

    @Column()
    zipCode: number;

    @Column()
    city: string;

    @OneToMany(() => OfferTripDB, (request) => request.startLocation)
    startLocationRequests: Promise<OfferTripDB[]>;

    @OneToMany(() => OfferTripDB, (request) => request.endLocation)
    endLocationRequests: Promise<OfferTripDB[]>;
}
