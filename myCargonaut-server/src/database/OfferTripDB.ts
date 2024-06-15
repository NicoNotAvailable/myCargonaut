import { ManyToOne, Column, OneToMany, ChildEntity } from 'typeorm';
import { LocationDB } from './LocationDB';
import { CargoDB } from './CargoDB';
import { TripDB } from './TripDB';
import { OfferDB } from './DriveDB';

@ChildEntity()
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
