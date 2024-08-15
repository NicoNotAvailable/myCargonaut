import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
import { ChangeStatusDTO } from './DTO/ChangeStatusDTO';
import { FilterDTO } from './DTO/FilterDTO';
import { ReviewService } from '../review/review.service';
import { SortingEnum } from '../database/enums/SortingEnum';

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
    private readonly reviewService: ReviewService,
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
        (locationData: CreateLocationDTO, index: number) => {
          const newLocation = this.locationRepository.create(locationData);
          newLocation.drive = savedOffer;
          newLocation.stopNr =
            index === body.location.length - 1 ? 100 : locationData.stopNr;
          return this.locationRepository.insert(newLocation);
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
      (locationData: CreateLocationDTO, index: number) => {
        const newLocation = this.locationRepository.create(locationData);
        newLocation.drive = savedRequest;
        newLocation.stopNr =
          index === body.location.length - 1 ? 100 : locationData.stopNr;
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
  async getAllOffers(user?: UserDB, filters?: FilterDTO): Promise<OfferDB[]> {
    const queryBuilder = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('offer.car', 'car')
      .leftJoinAndSelect('offer.trailer', 'trailer')
      .leftJoinAndSelect('offer.location', 'location');

    queryBuilder.andWhere('offer.status = 0');

    if (user) {
      queryBuilder.andWhere('offer.user.id != :userId', { userId: user.id });
    }
    if (filters?.date) {
      queryBuilder.andWhere('DATE(offer.date) = DATE(:date)', {
        date: filters.date,
      });
    }
    let offers = await queryBuilder.getMany();

    offers = await this.filterByRating(offers, filters?.minRating);

    offers = await this.applyOfferLocationFilters(
      offers,
      filters?.startLocation,
      filters?.endLocation,
    );

    offers = await this.applyOfferSizeFilters(offers, filters);

    if (filters?.sort) {
      offers = await this.sortOrder(offers, filters.sort);
    }

    if (offers.length == 0) {
      throw new NotFoundException('no matching offers found');
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

  async getAllRequests(
    user?: UserDB,
    filters?: FilterDTO,
  ): Promise<RequestDB[]> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.cargo', 'cargo')
      .leftJoinAndSelect('request.location', 'locations');

    queryBuilder.andWhere('request.status = 0');

    if (user) {
      queryBuilder.andWhere('request.user.id != :userId', { userId: user.id });
    }

    if (filters?.date) {
      queryBuilder.andWhere('DATE(request.date) = DATE(:date)', {
        date: filters.date,
      });
    }

    this.applyReqLocationFilters(
      queryBuilder,
      filters?.startLocation,
      filters?.endLocation,
    );

    const drives = await queryBuilder.getMany();

    let filteredDrives: RequestDB[] = await this.filterByRating(
      drives,
      filters?.minRating,
    );

    filteredDrives = await this.applyRequestSizeFilters(
      filteredDrives,
      filters,
    );

    if (filters?.sort) {
      filteredDrives = await this.sortOrder(filteredDrives, filters.sort);
    }

    if (!drives.length) {
      throw new NotFoundException('no matching requests found');
    }
    return filteredDrives;
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
  async updateOffer(
    offerId: number,
    userId: number,
    updateData: CreateOfferDTO,
  ): Promise<OfferDB> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['user'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    if (offer.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this offer');
    }

    Object.assign(offer, updateData);

    try {
      return await this.offerRepository.save(offer);
    } catch (error) {
      throw new Error('An error occurred while updating the offer');
    }
  }

  async updateRequest(
    requestId: number,
    userId: number,
    updateData: CreateRequestDTO,
  ): Promise<RequestDB> {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this request');
    }

    Object.assign(request, updateData);

    try {
      return await this.requestRepository.save(request);
    } catch (error) {
      throw new Error('An error occurred while updating the request');
    }
  }
  async updateStatus(
    offerId: number,
    userId: number,
    updateData: ChangeStatusDTO,
  ): Promise<DriveDB> {
    const drive = await this.driveRepository.findOne({
      where: { id: offerId },
      relations: ['user'],
    });
    if (!drive) {
      throw new NotFoundException('Offer not found');
    }
    if (drive.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this offer');
    }

    drive.status = updateData.newStatus;

    try {
      return await this.driveRepository.save(drive);
    } catch (error) {
      throw new Error('An error occurred while updating the offer');
    }
  }
  async deleteDrive(driveId: number, userId: number) {
    const drive = await this.driveRepository.findOne({
      where: { id: driveId },
      relations: ['user'],
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
    await this.driveRepository.remove(drive);
  }

  private applyReqLocationFilters(
    queryBuilder: SelectQueryBuilder<RequestDB>,
    startLocation?: string,
    endLocation?: string,
  ) {
    if (startLocation) {
      queryBuilder.andWhere(
        'locations.stopNr = 1 AND locations.city LIKE :startLocation',
        { startLocation: `%${startLocation}%` },
      );
    }

    if (endLocation) {
      queryBuilder.andWhere(
        'locations.stopNr = 100 AND locations.city LIKE :endLocation',
        { endLocation: `%${endLocation}%` },
      );
    }
  }

  private async applyOfferLocationFilters(
    offers: OfferDB[],
    startLocation?: string,
    endLocation?: string,
  ): Promise<OfferDB[]> {
    const filteredOffers: OfferDB[] = [];

    for (const offer of offers) {
      const locations = await offer.location;

      let isValid = true;

      if (startLocation && endLocation) {
        const location1 = locations.find(
          (loc) => loc.city.includes(startLocation) && loc.stopNr !== 100,
        );
        const hasValidEndLocation =
          location1 &&
          locations.some(
            (loc) =>
              loc.city.includes(endLocation) && loc.stopNr > location1.stopNr,
          );

        isValid = !!location1 && hasValidEndLocation;
      } else if (startLocation) {
        isValid = locations.some(
          (loc) => loc.city.includes(startLocation) && loc.stopNr !== 100,
        );
      } else if (endLocation) {
        isValid = locations.some(
          (loc) => loc.city.includes(endLocation) && loc.stopNr !== 1,
        );
      }
      if (isValid) {
        filteredOffers.push(offer);
      }
    }
    return filteredOffers;
  }

  private async applyOfferSizeFilters(
    offers: OfferDB[],
    filters?: FilterDTO,
  ): Promise<OfferDB[]> {
    if (!filters) return offers;

    return offers.filter((offer: OfferDB) => {
      let isValid: boolean = true;

      if (filters.seats && offer.car.seats < filters.seats) {
        isValid = false;
      }
      if (
        filters.weight &&
        offer.car.weight < filters.weight &&
        (!offer.trailer || offer.trailer.weight < filters.weight)
      ) {
        isValid = false;
      }
      if (
        filters.height &&
        offer.car.height < filters.height &&
        (!offer.trailer || offer.trailer.height < filters.height)
      ) {
        isValid = false;
      }
      if (
        filters.length &&
        offer.car.length < filters.length &&
        (!offer.trailer || offer.trailer.length < filters.length)
      ) {
        isValid = false;
      }
      if (
        filters.width &&
        offer.car.width < filters.width &&
        (!offer.trailer || offer.trailer.width < filters.width)
      ) {
        isValid = false;
      }
      return isValid;
    });
  }

  private async applyRequestSizeFilters(
    requests: RequestDB[],
    filters?: FilterDTO,
  ): Promise<RequestDB[]> {
    if (!filters) return requests;

    const filteredRequests: RequestDB[] = [];

    for (const request of requests) {
      const cargos = await request.cargo;

      const weight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
      const maxHeight = Math.max(...cargos.map((cargo) => cargo.height), 0);
      const maxLength = Math.max(...cargos.map((cargo) => cargo.length), 0);
      const maxWidth = Math.max(...cargos.map((cargo) => cargo.width), 0);

      let isValid = true;

      if (filters.seats && request.seats > filters.seats) {
        isValid = false;
      }

      if (filters.weight && weight > filters.weight) {
        isValid = false;
      }

      if (filters.height && maxHeight > filters.height) {
        isValid = false;
      }

      if (filters.length && maxLength > filters.length) {
        isValid = false;
      }

      if (filters.width && maxWidth > filters.width) {
        isValid = false;
      }

      if (isValid) {
        filteredRequests.push(request);
      }
    }
    return filteredRequests;
  }

  private async filterByRating(
    drives: any[],
    minRating?: number,
  ): Promise<any[]> {
    if (!minRating) return drives;

    const filteredDrives = [];
    for (const drive of drives) {
      const rating = await this.reviewService.getRating(drive.user.id);
      if (rating >= minRating) {
        filteredDrives.push(drive);
      }
    }
    return filteredDrives;
  }

  private async sortOrder(
    drives: DriveDB[],
    sortOrder: SortingEnum,
  ): Promise<any[]> {
    const order: number = Number(sortOrder);
    const drivesWithRatings = await Promise.all(
      drives.map(async (drive) => {
        const rating =
          (await this.reviewService.getRating(drive.user.id)) ?? -1;
        return { drive, rating };
      }),
    );
    drivesWithRatings.sort((a, b) => {
      if (order === 0) {
        return (
          new Date(b.drive.timestamp).getTime() -
          new Date(a.drive.timestamp).getTime()
        );
      } else if (order === 1) {
        return (
          new Date(a.drive.timestamp).getTime() -
          new Date(b.drive.timestamp).getTime()
        );
      } else if (order === 2) {
        return a.rating - b.rating;
      } else if (order === 3) {
        return b.rating - a.rating;
      } else if (order === 4) {
        return a.drive.price - b.drive.price;
      } else if (order === 5) {
        return b.drive.price - a.drive.price;
      }
    });
    return drivesWithRatings.map((item) => item.drive);
  }
}
