import { Column, ChildEntity, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { RequestTripDB } from './RequestTripDB';
import { OfferDB } from './DriveDB';

@ChildEntity()
export class TrailerDB extends VehicleDB {
    @Column()
    isCooled: boolean;

    @Column()
    isEnclosed: boolean;

    @OneToMany(() => OfferDB, (drive) => drive.trailer)
    rides: Promise<OfferDB[]>;

    @OneToMany(() => RequestTripDB, (drive) => drive.trailer)
    requestTrips: Promise<RequestTripDB[]>;
}
