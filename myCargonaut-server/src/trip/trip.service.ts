import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { Not, Repository } from 'typeorm';
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
import { StatusEnum } from '../database/enums/StatusEnum';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(TripDB)
    private tripRepository: Repository<TripDB>,
    @InjectRepository(OfferTripDB)
    private offerTripRepository: Repository<OfferTripDB>,
    @InjectRepository(RequestTripDB)
    private requestTripRepository: Repository<RequestTripDB>,
    @InjectRepository(CargoDB)
    private cargoRepository: Repository<CargoDB>,
    @InjectRepository(DriveDB)
    private driveRepository: Repository<DriveDB>,
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
      const savedOfferTrip = await this.offerTripRepository.save(newOfferTrip);
      const cargoPromises = body.cargo.map((cargoData: CreateCargoDTO) => {
        const newCargo = this.cargoRepository.create(cargoData);
        newCargo.offerTrip = savedOfferTrip;
        return this.cargoRepository.insert(newCargo);
      });
      await Promise.all(cargoPromises);
      return newOfferTrip;
    } catch (error) {
      throw new Error('An error occurred while saving the Trip');
    }
  }
  async getAllOfferTrips(offer: number): Promise<OfferTripDB[]> {
    const offerTrips = await this.offerTripRepository.find({
      where: { drive: { id: offer } },
      relations: ['requesting', 'startLocation', 'endLocation', 'drive'],
    });
    if (!offerTrips) {
      throw new NotFoundException('Request Trips not found');
    }
    return offerTrips;
  }
  async getOwnOfferTrips(user: number): Promise<OfferTripDB[]> {
    const offerTrips = await this.offerTripRepository.find({
      where: { requesting: { id: user } },
      relations: ['requesting', 'startLocation', 'endLocation', 'drive'],
    });
    if (!offerTrips) {
      throw new NotFoundException('Request Trips not found');
    }
    return offerTrips;
  }
  async getOfferTripById(id: number): Promise<OfferTripDB> {
    const offerTrip = await this.offerTripRepository.findOne({
      where: { id: id },
      relations: ['requesting', 'startLocation', 'endLocation', 'drive'],
    });
    if (!offerTrip) {
      throw new NotFoundException('Offer Trip not found');
    }
    return offerTrip;
  }
  async createRequestTrip(
    user: UserDB,
    drive: RequestDB,
    car: CarDB,
    trailer: TrailerDB | null,
  ): Promise<RequestTripDB> {
    const newRequestTrip: RequestTripDB = this.requestTripRepository.create();
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
  async getAllRequestTrips(request: number): Promise<RequestTripDB[]> {
    const requestTrips = await this.requestTripRepository.find({
      where: { drive: { id: request } },
      relations: ['requesting', 'car', 'trailer', 'drive'],
    });
    if (!requestTrips) {
      throw new NotFoundException('Request Trips not found');
    }
    return requestTrips;
  }
  async getOwnRequestTrips(user: number): Promise<RequestTripDB[]> {
    const requestTrips = await this.requestTripRepository.find({
      where: { requesting: { id: user } },
      relations: ['requesting', 'car', 'trailer', 'drive'],
    });
    if (!requestTrips) {
      throw new NotFoundException('Request Trips not found');
    }
    return requestTrips;
  }
  async getRequestTripById(id: number): Promise<RequestTripDB> {
    const requestTrip = await this.requestTripRepository.findOne({
      where: { id: id },
      relations: ['requesting', 'car', 'trailer', 'drive'],
    });
    if (!requestTrip) {
      throw new NotFoundException('Request Trip not found');
    }
    return requestTrip;
  }

  async acceptTrip(tripId: number, userId: number): Promise<void> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
    });
    if (trip instanceof OfferTripDB) {
      await this.acceptOfferTrip(tripId, userId);
    }
    if (trip instanceof RequestTripDB) {
      await this.acceptRequestTrip(tripId, userId);
    }
  }
  async acceptOfferTrip(tripId: number, userId: number): Promise<void> {
    const trip = await this.offerTripRepository.findOne({
      where: { id: tripId },
      relations: ['drive', 'drive.user'],
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.drive.user.id !== userId) {
      throw new UnauthorizedException('You are not the creator of this drive');
    }
    trip.drive.status = StatusEnum.accepted;
    await this.driveRepository.save(trip.drive);
    const otherTrips = await this.offerTripRepository.find({
      where: { drive: trip.drive, id: Not(trip.id) },
    });
    await this.tripRepository.remove(otherTrips);
  }
  async acceptRequestTrip(tripId: number, userId: number): Promise<void> {
    const trip = await this.requestTripRepository.findOne({
      where: { id: tripId },
      relations: ['drive', 'drive.user'],
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.drive.user.id !== userId) {
      throw new UnauthorizedException('You are not the creator of this drive');
    }
    trip.drive.status = StatusEnum.accepted;
    await this.driveRepository.save(trip.drive);
    const otherTrips = await this.requestTripRepository.find({
      where: { drive: trip.drive, id: Not(trip.id) },
    });
    await this.tripRepository.remove(otherTrips);
  }
  async deleteTrip(tripId: number, userId: number) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['requesting'],
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.tripRepository.remove(trip);
  }
  async getUserTrips(user: number) {
    console.log('userId ' + user);
    const offerTrips = await this.offerTripRepository.find({
      where: { requesting: { id: user } },
      relations: ['requesting', 'drive', 'messages', 'drive.user'],
    });

    const requestTrips = await this.requestTripRepository.find({
      where: { requesting: { id: user } },
      relations: ['requesting', 'car', 'trailer', 'drive', 'drive.user'],
    });

    const offerDriveTrips = await this.offerTripRepository.find({
      where: { drive: { user: { id: user } } },
      relations: [
        'drive',
        'drive.user',
        'messages',
        'drive.user',
        'requesting',
      ],
    });

    const requestDriveTrips = await this.requestTripRepository.find({
      where: { drive: { user: { id: user } } },
      relations: [
        'drive',
        'drive.user',
        'messages',
        'drive.user',
        'requesting',
      ],
    });

    return { offerTrips, requestTrips, offerDriveTrips, requestDriveTrips };
  }
}
