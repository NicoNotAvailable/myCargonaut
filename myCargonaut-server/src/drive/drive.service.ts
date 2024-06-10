import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { UserDB } from '../database/UserDB';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(DriveDB)
    private driveRepository: Repository<DriveDB>,
    @InjectRepository(OfferDB)
    private offerRepository: Repository<OfferDB>,
    @InjectRepository(RequestDB)
    private requestRepository: Repository<RequestDB>,
  ) {}

  async createOffer(
    user: UserDB,
    car: CarDB,
    trailer: TrailerDB,
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
    if (trailer instanceof TrailerDB) {
      newOffer.trailer = trailer;
    } else {
      throw new Error('Invalid owner type');
    }
    // Set the values for the new offer
    newOffer.name = body.name.trim();
    newOffer.date = body.date;
    newOffer.price = body.price;
    newOffer.seats = body.seats;
    newOffer.animalsAllowed = body.animalsAllowed;
    newOffer.smokingAllowed = body.smokingAllowed;
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
      throw new Error('An error occurred while saving the car');
    }
  }
}
