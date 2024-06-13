import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { Repository } from 'typeorm';
import { CargoDB } from '../database/CargoDB';
import { TripDB } from '../database/TripDB';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';
import { UserDB } from '../database/UserDB';
import { CreateOfferTripDTO } from './DTO/CreateOfferTripDTO';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';
import { CreateCargoDTO } from '../cargo/DTO/CreateCargoDTO';
import { LocationDB } from '../database/LocationDB';

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(DriveDB)
        private tripRepository: Repository<TripDB>,
        @InjectRepository(OfferTripDB)
        private offerTripRepository: Repository<OfferTripDB>,
        @InjectRepository(RequestTripDB)
        private requestTripRepository: Repository<RequestTripDB>,
        @InjectRepository(CargoDB)
        private cargoRepository: Repository<CargoDB>,
    ) {}

    async createOfferTrip(
        user: UserDB,
        drive: OfferDB,
        body: CreateOfferTripDTO,
        startLocation: LocationDB,
        endLocation: LocationDB,
    ): Promise<OfferTripDB> {
        const newOfferTrip: OfferTripDB = this.offerTripRepository.create();
        if (user instanceof UserDB) {
            newOfferTrip.requesting = user;
        } else {
            throw new Error('Invalid owner type');
        }
        if (drive instanceof OfferDB) {
            newOfferTrip.drive = drive;
        } else {
            throw new Error('Invalid offer type');
        }
        newOfferTrip.usedSeats = body.usedSeats;
        newOfferTrip.startLocation = startLocation;
        newOfferTrip.endLocation = endLocation;
        try {
            const savedOfferTrip =
                await this.offerTripRepository.save(newOfferTrip);
            const cargoPromises = body.cargo.map(
                (cargoData: CreateCargoDTO) => {
                    const newCargo = this.cargoRepository.create(cargoData);
                    newCargo.offerTrip = savedOfferTrip;
                    return this.cargoRepository.insert(newCargo);
                },
            );
            await Promise.all(cargoPromises);
            return newOfferTrip;
        } catch (error) {
            throw new Error('An error occurred while saving the Trip');
        }
    }

    async createRequestTrip(
        user: UserDB,
        drive: RequestDB,
        car: CarDB,
        trailer: TrailerDB | null,
    ): Promise<RequestTripDB> {
        const newRequestTrip: RequestTripDB =
            this.requestTripRepository.create();
        if (user instanceof UserDB) {
            newRequestTrip.requesting = user;
        } else {
            throw new Error('Invalid owner type');
        }
        if (drive instanceof RequestDB) {
            newRequestTrip.drive = drive;
        } else {
            throw new Error('Invalid request type');
        }
        if (car instanceof CarDB) {
            newRequestTrip.car = car;
        } else {
            throw new Error('Invalid car type');
        }
        if (trailer === null || trailer instanceof TrailerDB) {
            newRequestTrip.trailer = trailer;
        } else {
            throw new Error('Invalid trailer type');
        }
        try {
            return await this.requestTripRepository.save(newRequestTrip);
        } catch (error) {
            throw new Error('An error occurred while saving the Trip');
        }
    }
}
