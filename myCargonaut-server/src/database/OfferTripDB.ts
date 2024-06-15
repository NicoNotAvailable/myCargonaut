import { Entity, ManyToOne, Column, OneToMany } from 'typeorm';
import { LocationDB } from './LocationDB';
import { CargoDB } from './CargoDB';
import { TripDB } from './TripDB';
import { OfferDB } from './DriveDB';

@Entity()
export class OfferTripDB extends TripDB {
    @ManyToOne(() => OfferDB, { onDelete: 'CASCADE' })
    drive: OfferDB;

    @ManyToOne(() => LocationDB, { onDelete: 'CASCADE' })
    startLocation: LocationDB;

    @ManyToOne(() => LocationDB, { onDelete: 'CASCADE' })
    endLocation: LocationDB;

    @Column()
    usedSeats: number;

    @OneToMany(() => CargoDB, (cargo) => cargo.offerTrip, { onDelete: 'CASCADE' })
    cargo: Promise<CargoDB[]>;
}
