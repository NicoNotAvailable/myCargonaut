import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { Repository } from 'typeorm';
import { CargoDB } from '../database/CargoDB';
import { TripDB } from '../database/TripDB';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';
import { UserDB } from '../database/UserDB';

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(DriveDB)
        private tripRepository: Repository<TripDB>,
        @InjectRepository(OfferDB)
        private offerTripRepository: Repository<OfferTripDB>,
        @InjectRepository(RequestDB)
        private requestTripRepository: Repository<RequestTripDB>,
        @InjectRepository(CargoDB)
        private cargoRepository: Repository<CargoDB>,
    ) {}

    async createOfferTrip(
        user: UserDB,
        drive: OfferDB,
        body: CreateOfferTripDTO,
    ): Promise<OfferDB> {
        const newOfferTrip: OfferTripDB = this.offerTripRepository.create();
        if (user instanceof UserDB) {
            newOfferTrip.requesting = user;
        } else {
            throw new Error('Invalid owner type');
        }
        if (drive instanceof DriveDB) {
            newOfferTrip.drive = drive;
        } else {
            throw new Error('Invalid owner type');
        }
        // Set the values for the new offer
        newOfferTrip.usedSeats = body.usedSeats;
        try {
            return await this.offerTripRepository.save(newOfferTrip);
        } catch (error) {
            throw new Error('An error occurred while saving the Trip');
        }
    }
}
