import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { StatusEnum } from '../database/enums/StatusEnum';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';

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
    @InjectRepository(LocationDB)
    private locationRepository: Repository<LocationDB>,
    @InjectRepository(OfferTripDB)
    private offerTripRepository: Repository<OfferTripDB>,
    @InjectRepository(RequestTripDB)
    private requestTripRepository: Repository<RequestTripDB>,
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
    newOffer.maxTLength = body.maxTLength;
    try {
      const savedOffer = await this.offerRepository.save(newOffer);

      const locationPromises = body.location.map(
        (locationData: CreateLocationDTO) => {
          const newLocation = this.locationRepository.create(locationData);
          newLocation.drive = savedOffer;
          this.locationRepository.insert(newLocation);
        },
      );

      await Promise.all(locationPromises);

      return savedOffer;
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

    if (body.cargo) {
      const cargoPromises = body.cargo.map((cargoData: CreateCargoDTO) => {
        const newCargo = this.cargoRepository.create(cargoData);
        newCargo.request = savedRequest;
        return this.cargoRepository.save(newCargo);
      });
      await Promise.all(cargoPromises);
    }
    const locationPromises = body.location.map(
      (locationData: CreateLocationDTO) => {
        const newLocation = this.locationRepository.create(locationData);
        newLocation.drive = savedRequest;
        return this.locationRepository.insert(newLocation);
      },
    );

    await Promise.all(locationPromises);

    return savedRequest;
  }
  async getOfferById(driveID: number): Promise<OfferDB> {
    const drive = await this.offerRepository.findOne({
      where: { id: driveID },
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!drive) {
      throw new NotFoundException('Offer not found');
    }
    return drive;
  }
  async getRequestById(driveID: number): Promise<RequestDB> {
    const drive = await this.requestRepository.findOne({
      where: { id: driveID },
      relations: ['user', 'cargo', 'location'],
    });
    if (!drive) {
      throw new NotFoundException('Request not found');
    }
    return drive;
  }
  async getAllOffers(): Promise<OfferDB[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!offers) {
      throw new NotFoundException('Offers not found');
    }
    return offers;
  }
  async getOwnOffers(user: number): Promise<OfferDB[]> {
    const offers = await this.offerRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!offers) {
      throw new NotFoundException('Offers not found');
    }
    return offers;
  }
  async getAllRequests(): Promise<RequestDB[]> {
    const requests = await this.requestRepository.find({
      relations: ['user', 'cargo', 'location'],
    });
    if (!requests) {
      throw new NotFoundException('Requests not found');
    }
    return requests;
  }
  async getOwnRequests(user: number): Promise<RequestDB[]> {
    const requests = await this.requestRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'cargo', 'location'],
    });
    if (!requests) {
      throw new NotFoundException('Requests not found');
    }
    return requests;
  }
  async deleteDrive(driveId: number, userId: number) {
    const drive = await this.driveRepository.findOne({
      where: { id: driveId },
      relations: ['owner'],
    });
    if (!drive) {
      throw new NotFoundException('Drive not found');
    }
    if (drive.user.id !== userId) {
      throw new UnauthorizedException('Drive is not yours!');
    }
    if (drive.status !== StatusEnum.created) {
      throw new BadRequestException(
        'Drive cannot be deleted because it is not in the created status',
      );
    }
    const acceptedOfferTrip = await this.offerTripRepository.findOne({
      where: {
        drive: { id: driveId },
        isAccepted: true,
      },
    });
    if (acceptedOfferTrip) {
      throw new BadRequestException(
        'Drive cannot be deleted because there are accepted offer trips associated with it',
      );
    }
    const acceptedRequestTrip = await this.requestTripRepository.findOne({
      where: {
        drive: { id: driveId },
        isAccepted: true,
      },
    });

    if (acceptedRequestTrip) {
      throw new BadRequestException(
        'Drive cannot be deleted because there are accepted request trips associated with it',
      );
    }
    await this.driveRepository.remove(drive);
  }
}
