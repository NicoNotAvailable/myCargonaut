import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    TableInheritance,
    ChildEntity,
} from 'typeorm';
import { UserDB } from './UserDB';
import { TripInfoEnum } from './enums/TripInfoEnum';
import { LocationDB } from './LocationDB';
import { CarDB } from './CarDB';
import { TrailerDB } from './TrailerDB';
import { PriceTypeEnum } from './enums/PriceTypeEnum';
import { OfferTripDB } from './OfferTripDB';
import { CargoDB } from './CargoDB';
import { RequestTripDB } from './RequestTripDB';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DriveDB {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDB)
    user: UserDB;

    @Column()
    price: number;

    @Column()
    date: Date;

    @Column({ nullable: true })
    seats: number;

    @Column()
    animalsAllowed: boolean;

    @Column()
    smokingAllowed: boolean;

    @Column()
    info: TripInfoEnum;

    @Column({ default: new Date().toISOString() })
    timestamp: string;

    @OneToMany(() => LocationDB, (location) => location.drive)
    location: Promise<LocationDB>;
}

@ChildEntity()
export class OfferDB extends DriveDB {
    @ManyToOne(() => CarDB)
    car: CarDB;

    @ManyToOne(() => TrailerDB)
    trailer: TrailerDB;

    @Column()
    priceType: PriceTypeEnum;

    @Column()
    maxCWeight: number;

    @Column()
    maxCLength: number;

    @Column()
    maxCHeight: number;

    @Column()
    maxCWidth: number;

    @Column()
    maxTWeight: number;

    @Column()
    maxTLength: number;

    @Column()
    maxTHeight: number;

    @Column()
    maxTWidth: number;

    @OneToMany(() => OfferTripDB, (trip) => trip.drive)
    trips: Promise<OfferTripDB[]>;
}

@ChildEntity()
export class RequestDB extends DriveDB {
    @OneToMany(() => CargoDB, (cargo) => cargo.request)
    cargo: Promise<CargoDB[]>;

    @OneToMany(() => RequestTripDB, (trip) => trip.drive)
    trips: Promise<RequestTripDB[]>;
}
