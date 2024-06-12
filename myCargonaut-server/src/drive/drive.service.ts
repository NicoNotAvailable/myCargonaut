import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { UserDB } from '../database/UserDB';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';
import { CargoDB } from '../database/CargoDB';
import { CreateCargoDTO } from '../cargo/DTO/CreateCargoDTO';
import { CreateRequestDTO } from './DTO/CreateRequestDTO';
import { LocationDB } from '../database/LocationDB';
import { CreateLocationDTO } from '../location/DTO/CreateLocationDTO';

@Injectable()
export class DriveService {
    constructor(
        @InjectRepository(DriveDB)
        private driveRepository: Repository<DriveDB>,
        @InjectRepository(OfferDB)
        private offerRepository: Repository<OfferDB>,
        @InjectRepository(RequestDB)
        private requestRepository: Repository<RequestDB>,
        @InjectRepository(CargoDB)
        private cargoRepository: Repository<CargoDB>,
        @InjectRepository(CargoDB)
        private locationRepository: Repository<LocationDB>,
    ) {}

    async createOffer(
        user: UserDB,
        car: CarDB,
        trailer: TrailerDB | null,
        body: CreateOfferDTO,
    ): Promise<OfferDB> {
        const newOffer: OfferDB = this.offerRepository.create();
        if (user instanceof UserDB) {
            newOffer.user = user;
        } else {
            throw new Error('Invalid owner type');
        }
        if (car instanceof CarDB) {
            newOffer.car = car;
        } else {
            throw new Error('Invalid car type');
        }
        if (trailer === null || trailer instanceof TrailerDB) {
            newOffer.trailer = trailer;
        } else {
            throw new Error('Invalid trailer type');
        }
        // Set the values for the new offer
        newOffer.name = body.name.trim();
        newOffer.date = body.date;
        newOffer.price = body.price;
        newOffer.seats = body.seats;
        newOffer.animalsAllowed = body.animalsAllowed;
        newOffer.smokingAllowed = body.smokingAllowed;
        newOffer.info = body.info;
        newOffer.priceType = body.priceType;
        newOffer.maxCWeight = body.maxCWeight;
        newOffer.maxCWidth = body.maxCWidth;
        newOffer.maxCHeight = body.maxCHeight;
        newOffer.maxCLength = body.maxCLength;
        newOffer.maxTWeight = body.maxTWeight;
        newOffer.maxTWidth = body.maxTWidth;
        newOffer.maxTWidth = body.maxTWidth;
        newOffer.maxTLength = body.maxTLength;
        try {
            return await this.offerRepository.save(newOffer);
        } catch (error) {
            throw new Error('An error occurred while saving the offer');
        }
    }
    async createRequest(
        user: UserDB,
        body: CreateRequestDTO,
    ): Promise<RequestDB> {
        const newRequest = this.requestRepository.create();
        newRequest.user = user;
        newRequest.name = body.name;
        newRequest.date = body.date;
        newRequest.price = body.price;
        newRequest.seats = body.seats;
        newRequest.info = body.info;
        newRequest.smokingAllowed = body.smokingAllowed;
        newRequest.animalsAllowed = body.animalsAllowed;

        const savedRequest = await this.requestRepository.save(newRequest);

        if (body.cargo){
        const cargoPromises = body.cargo.map((cargoData: CreateCargoDTO) => {
            const newCargo = this.cargoRepository.create(cargoData);
            newCargo.request = savedRequest;
            return this.cargoRepository.save(newCargo);
        });
        await Promise.all(cargoPromises);
        }
        const locationPromises = body.location.map(
            (locationData: CreateLocationDTO) => {
                const newLocation =
                    this.locationRepository.create(locationData);
                newLocation.drive = savedRequest;
                return this.cargoRepository.save(newLocation);
            },
        );

        await Promise.all(locationPromises);

        return savedRequest;
    }
}
